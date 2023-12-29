import { cache } from "react"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseHybridSearch } from "langchain/retrievers/supabase"

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

export async function POST(
  request: NextRequest,
  { params: { user_id } }: { params: { user_id: string } }
) {
  const header = request.headers.get("x-api-key")
  if (header !== process.env.GPT_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
    })
  }

  const { keywords } = (await request.json()) as { keywords: string }
  if (!keywords) {
    return new Response(JSON.stringify({ error: "input is required" }), {
      status: 400,
    })
  }

  if (!user_id) {
    return new Response(JSON.stringify({ error: "user_id is required" }), {
      status: 400,
    })
  }

  const supabase = createServerSupabaseClient()
  const embeddings = new OpenAIEmbeddings()

  const retriever = new SupabaseHybridSearch(embeddings, {
    client: supabase,
    similarityK: 5,
    keywordK: 5,
    tableName: "summaries",
    similarityQueryName: "match_summaries",
    keywordQueryName: "kw_match_summaries",
  })
  const results = await retriever.getRelevantDocuments(keywords)

  return new Response(JSON.stringify(results), {
    status: 200,
  })
}
