import { cache } from "react"
import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import type { Document } from "langchain/document"
import { YoutubeLoader } from "langchain/document_loaders/web/youtube"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

import type { Database } from "@/lib/database.types"
import { handleComplexLinkEmailSend } from "@/lib/resend"
import { fetchAndParseURL, isYouTubeURL, splitDocuments } from "@/lib/utils"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    }
  )
})

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")
  if (apiKey !== process.env.GPT_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
    })
  }

  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get("url")
  const user_id = searchParams.get("user_id")

  if (!user_id || !url) {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
    })
  }

  const response = await fetch(url)
  const html = await response.text()
  const titleMatch = html.match(/<title>(.*?)<\/title>/)
  const descMatch = html.match(/<meta name="description" content="(.*?)"/)
  const faviconMatch = html.match(/<link rel="icon" href="(.*?)"/)

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("sources")
    .insert({
      url,
      title: titleMatch ? titleMatch[1] : url,
      description: descMatch ? descMatch[1] : undefined,
      icon: faviconMatch ? faviconMatch[1] : undefined,
      user_id,
      type: "LINK",
    })
    .select("*")
    .single()

  if (error) {
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
    })
  }

  if (!data || !data.url || !data.title) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    })
  }

  const embeddings = new OpenAIEmbeddings()
  const store = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: "summaries",
  })

  const isYoutubeURL = isYouTubeURL(data.url)
  const isNotCrawalableLink =
    data?.title && data.url && data?.title === data?.url
  const isComplexLink = isYoutubeURL || isNotCrawalableLink

  if (isComplexLink) {
    await handleComplexLinkEmailSend(data)

    if (isYoutubeURL) {
      const loader = YoutubeLoader.createFromUrl(data.url, {
        language: "en",
        addVideoInfo: true,
      })

      const docs = await loader.load()
      const splitDocs = splitDocuments(docs)
      const docsWithMetadata = splitDocs.map((doc) => ({
        ...doc,
        metadata: {
          user_id: data.user_id,
          source_id: data.id,
          url: data.url,
          title: data.title,
        },
      }))
      const storedIds = await store.addDocuments(docsWithMetadata)

      if (storedIds.length) {
        await supabase.from("notifications").insert({
          title: "Your summary is ready!",
          description: `Your summary for "${data.title.slice(0, 50)}${
            data.title.length > 50 ? "..." : ""
          }" is done and is already added to your Knowledge Hub`,
          user_id: data.user_id,
        })
      }
      return new NextResponse(JSON.stringify({ ids: storedIds }), {
        status: 200,
      })
    }

    return new NextResponse(
      JSON.stringify({ message: "Parsing is not possible for this source" }),
      {
        status: 200,
      }
    )
  }

  const content = await fetchAndParseURL(data.url)
  const doc: Document[] = [
    {
      pageContent: content,
      metadata: {
        user_id: data.user_id,
        source_id: data.id,
        url: data.url,
        title: data.title,
        author: "gpt",
      },
    },
  ]

  const splitDocs = splitDocuments(doc)
  const storedIds = await store.addDocuments(splitDocs)

  await supabase.from("notifications").insert({
    title: "Your summary is ready!",
    description: `Your summary for "${data.title.slice(0, 50)}${
      data.title.length > 50 ? "..." : ""
    }" is done and is already added to your Knowledge Hub`,
    user_id: data.user_id,
  })

  return new NextResponse(JSON.stringify({ success: !!storedIds.length }), {
    status: 200,
  })
}
