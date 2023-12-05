import { cache } from "react"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"
import OpenAI from "openai"
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs"

import type { Database } from "@/lib/database.types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
})

export const runtime = "edge"
const embeddings = new OpenAIEmbeddings()

export async function POST(req: Request) {
  const { messages } = (await req.json()) as {
    messages: { content: string; role: string }[]
  }

  const supabase = createServerSupabaseClient()
  const store = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: "summaries",
    queryName: "match_summaries",
  })

  const lastMessage = messages.at(-1)
  const searchQuery = lastMessage?.content ?? ""
  const results = await store.similaritySearch(searchQuery, 3)

  const messagesWithContext = messages.map((m) => {
    if (m.content !== searchQuery) return m
    const context = results[0].pageContent
    return {
      ...m,
      content: `${m.content}\n\nContext: ${context}`,
    }
  })
  const messagesWithSystemAndContext = [
    {
      role: "system",
      content:
        'You are a helpful assitant that provided answers based on the context. If the context does not contain an answer - you reply with "I dont know"',
    },
    ...messagesWithContext,
  ]

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    stream: true,
    messages: messagesWithSystemAndContext as ChatCompletionMessageParam[],
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
