import { cache } from "react"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import dayjs from "dayjs"
import type { Document } from "langchain/document"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"
import OpenAI from "openai"
import type {
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs"

import type { Database } from "@/lib/database.types"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    }
  )
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const systemMessage: ChatCompletionSystemMessageParam = {
  role: "system",
  content: `
    You are a helpful assistant that generates a title based of the user's text. 
    You should generate short titles, not exceeding 8 words or 40 characters.
    Output just title without quotes or any other symbols.
    `,
}

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key")
  if (apiKey !== process.env.GPT_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
    })
  }

  const { text, user_id } = (await request.json()) as {
    text: string | undefined
    user_id: string | undefined
  }

  if (!user_id || !text) {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
    })
  }

  const chatRequest: ChatCompletionUserMessageParam = {
    role: "user",
    content: `User text: ${text}`,
  }

  const titleResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [systemMessage, chatRequest],
  })
  const title = titleResponse.choices[0].message.content || text.slice(0, 50)

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("sources")
    .insert({
      title: title,
      description: text,
      user_id,
      estimate: {
        humanReadable: "0s",
        time: 0,
        deadline: dayjs().toISOString(),
      },
      full_text: true,
      type: "NOTE",
    })
    .select("*")
    .single()

  if (error) {
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
    })
  }

  const embeddings = new OpenAIEmbeddings()
  const store = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: "summaries",
  })

  const docs: Document[] = [
    {
      pageContent: text,
      metadata: {
        user_id: user_id,
        source_id: data.id,
        title,
        author: "gpt",
      },
    },
  ]

  const storedIds = await store.addDocuments(docs)

  return new NextResponse(JSON.stringify({ succeess: !!storedIds.length }), {
    status: 200,
  })
}
