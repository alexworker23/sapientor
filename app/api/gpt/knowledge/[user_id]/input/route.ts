import { cache } from "react"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { createRetrieverTool } from "langchain/agents/toolkits"
import { ChatOpenAI } from "langchain/chat_models/openai"
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

const TEMPLATE = `You are a helpful assistant and must find the relevant data from the documents according to user's input.
If you don't know how to answer a question, use the available tools to look up relevant information.`

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

  const { input } = (await request.json()) as { input: string }
  if (!input) {
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
  const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client: supabase,
    tableName: "summaries",
    queryName: "match_summaries",
    filter: { user_id },
  })
  const retriever = vectorstore.asRetriever()
  const tool = createRetrieverTool(retriever, {
    name: "search_latest_knowledge",
    description: "Searches and returns up-to-date general information.",
  })
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo-1106",
  })
  const executor = await initializeAgentExecutorWithOptions([tool], model, {
    agentType: "openai-functions",
    returnIntermediateSteps: true,
    agentArgs: {
      prefix: TEMPLATE,
    },
  })

  const result = await executor.call({ input })

  return new Response(JSON.stringify({ result: result.output }), {
    status: 200,
  })
}
