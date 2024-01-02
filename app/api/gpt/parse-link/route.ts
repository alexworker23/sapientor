import { cache } from "react"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import dayjs from "dayjs"
import type { Document } from "langchain/document"
import { YoutubeLoader } from "langchain/document_loaders/web/youtube"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"
import OpenAI from "openai"
import type {
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs"

import type { Database } from "@/lib/database.types"
import { handleComplexLinkEmailSend } from "@/lib/resend"
import type { ParsingEstimate } from "@/lib/types"
import {
  fetchAndParseURL,
  isYouTubeURL,
  msToHumanReadable,
  splitDocuments,
} from "@/lib/utils"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    }
  )
})

const systemMessage: ChatCompletionSystemMessageParam = {
  role: "system",
  content: `
    You a helpful assistant that gives his estimates on time for parsing a certain URL content. 
    You should first undestand what type of content user wants to parse based on the URL and title.
    You will use the following benchmarks for your estimates:
    - Work hours are from 9:00 to 20:00 CET, so if the user timezone is different, you should take that into account.
    - For videos, you should estimate 5hrs for each 30 min of video.
    - For articles, you should estimate 1hr per URL.
    - For podcasts, you should estimate 5hrs for each 30 min of podcast.
    - For books, you should estimate 10hrs for each 100 pages of the book.
    - For courses, you should estimate 5hrs for each 30 min of video.
    - For all other content types, you should estimate 1hr per URL.
    For example, if the URL is a YouTube video, you should take the video type estimation benchmark.
    1h = 3600000ms
    You reply in a JSON format following the schema:
    { 
        "time": "3600000", // time in ms
    }
    `,
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key")
  if (apiKey !== process.env.GPT_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
    })
  }

  const { url, user_id } = (await request.json()) as {
    url: string | undefined
    user_id: string | undefined
  }

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

  const chatRequest: ChatCompletionUserMessageParam = {
    role: "user",
    content: `
        Title: ${titleMatch ? titleMatch[1] : url}
        URL: ${url}
        User Time: ${dayjs().toISOString()}
    `,
  }

  const estimateResponse = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    response_format: { type: "json_object" },
    messages: [systemMessage, chatRequest],
  })

  const estimateTimeString = estimateResponse.choices[0].message.content
    ? JSON.parse(estimateResponse.choices[0].message.content).time
    : "3600000"
  const estimateMs = parseInt(estimateTimeString)

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("sources")
    .insert({
      url,
      title: titleMatch ? titleMatch[1] : url,
      description: descMatch ? descMatch[1] : undefined,
      icon: faviconMatch ? faviconMatch[1] : undefined,
      user_id,
      estimate: {
        time: estimateMs,
        deadline: dayjs().add(estimateMs, "ms").toISOString(),
        humanReadable: msToHumanReadable(estimateMs),
      },
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

  const isLongParsingTime =
    (data?.estimate as ParsingEstimate)?.time &&
    !isNaN((data?.estimate as ParsingEstimate)?.time) &&
    (data?.estimate as ParsingEstimate)?.time > 3600000
  const isNotCrawalableLink =
    data?.title && data.url && data?.title === data?.url
  const isComplexLink = isLongParsingTime || isNotCrawalableLink

  if (isComplexLink) {
    await handleComplexLinkEmailSend(data)

    if (isYouTubeURL(data.url)) {
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

  return new NextResponse(JSON.stringify({ succeess: !!storedIds.length }), {
    status: 200,
  })
}
