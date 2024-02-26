import { cache } from "react"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import type { Document } from "langchain/document"
import { YoutubeLoader } from "langchain/document_loaders/web/youtube"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

import type { Database } from "@/lib/database.types"
import { handleComplexLinkEmailSend } from "@/lib/resend"
import { fetchAndParseURL, isYouTubeURL, splitDocuments } from "@/lib/utils"

export const maxDuration = 10

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
})

export async function POST(req: Request) {
  const { source_id } = (await req.json()) as {
    source_id: string | undefined
  }

  if (!source_id) {
    return new NextResponse(
      JSON.stringify({ error: "Source ID is required" }),
      {
        status: 400,
      }
    )
  }

  const supabase = createServerSupabaseClient()
  const embeddings = new OpenAIEmbeddings()
  const store = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: "summaries",
  })

  const { data, error } = await supabase
    .from("sources")
    .select("url, title, description, user_id")
    .eq("id", source_id)
    .single()

  if (error) {
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
    })
  }

  if (!data?.url || !data?.title) {
    return new NextResponse("Missing source data", {
      status: 400,
    })
  }

  const isNotCrawalableLink =
    data?.title && data.url && data?.title === data?.url
  const isYouTubeLink = isYouTubeURL(data.url)
  const isComplexLink = isNotCrawalableLink || isYouTubeLink

  if (isComplexLink) {
    await handleComplexLinkEmailSend(data)

    if (isYouTubeLink) {
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
          source_id,
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
        source_id,
        url: data.url,
        title: data.title,
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

  return new NextResponse(JSON.stringify({ ids: storedIds }), {
    status: 200,
  })
}

// CREATING SUMMARIES FUNCTIONALITY

// prompt
// const systemMessage: ChatCompletionSystemMessageParam = {
//   role: "system",
//   content: `You are a helpful assistant, that helps people create a summary of a webpage content.
//     You will receive a full webpage content from a user and you need to create a summary of it.
//     You outline the main points of the webpage content and send it back to the user.
//   `,
// }

// generation functionality
// const chatRequest: ChatCompletionUserMessageParam = {
//   role: "user",
//   content: `Webpage Content: ${webpageContent}`,
// }
// const response = await openai.chat.completions.create({
//   model: "gpt-4-1106-preview",
//   messages: [systemMessage, chatRequest],
// })
// const summary = response.choices[0].message.content
// const contentToSave = `
//   ${data.title}
//   ${data.description}
//   ${summary}
// `
