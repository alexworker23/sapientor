import { cache } from "react"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import dayjs from "dayjs"
import type { Document } from "langchain/document"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

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

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key")
  if (apiKey !== process.env.GPT_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
    })
  }

  const { url, title, content, description, user_id } =
    (await request.json()) as {
      url: string | undefined
      title: string | undefined
      description: string | undefined
      content: string | undefined
      user_id: string | undefined
    }

  if (!content || !user_id || !title || !url) {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
    })
  }

  const supabase = createServerSupabaseClient()

  const { data: link } = await supabase
    .from("sources")
    .insert({
      url,
      estimate: { time: 0, deadline: dayjs().toISOString() },
      title,
      description,
      user_id,
    })
    .select("*")
    .single()

  if (!link) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    })
  }

  const contentToSave = `
    ${title}
    ${description}
    ${content}
  `

  const embeddings = new OpenAIEmbeddings()
  const store = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: "summaries",
  })

  const docs: Document[] = [
    {
      pageContent: contentToSave,
      metadata: { user_id, link_id: link.id, url, title, author: "gpt" },
    },
  ]

  const storedIds = await store.addDocuments(docs)

  if (storedIds.length === 0) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ data: { link, storedIds } }), {
    status: 200,
  })
}
