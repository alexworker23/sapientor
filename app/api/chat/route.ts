import { cache } from "react"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { StreamingTextResponse, Message as VercelChatMessage } from "ai"
import { initializeAgentExecutorWithOptions } from "langchain/agents"
import {
  createRetrieverTool,
  OpenAIAgentTokenBufferMemory,
} from "langchain/agents/toolkits"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { ChatMessageHistory } from "langchain/memory"
import { AIMessage, ChatMessage, HumanMessage } from "langchain/schema"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

import type { Database } from "@/lib/database.types"

export const runtime = "edge"

// reference:
// https://langchain-nextjs-template.vercel.app/retrieval_agents

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content)
  } else if (message.role === "assistant") {
    return new AIMessage(message.content)
  } else {
    return new ChatMessage(message.content, message.role)
  }
}

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
})

const TEMPLATE = `You are a helpful assistant and must answer all questions asked by the user.

If you don't know how to answer a question, use the available tools to look up relevant information.`

/**
 * This handler initializes and calls a retrieval agent. It requires an OpenAI
 * Functions model. See the docs for more information:
 *
 * https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    /**
     * We represent intermediate steps as system messages for display purposes,
     * but don't want them in the chat history.
     */
    const messages = (body.messages ?? []).filter(
      (message: VercelChatMessage) =>
        message.role === "user" || message.role === "assistant"
    )
    const returnIntermediateSteps = body.show_intermediate_steps
    const previousMessages = messages.slice(0, -1)
    const currentMessageContent = messages[messages.length - 1].content

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-1106",
    })

    const client = createServerSupabaseClient()
    const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
      client,
      tableName: "summaries",
      queryName: "match_summaries",
    })

    const chatHistory = new ChatMessageHistory(
      previousMessages.map(convertVercelMessageToLangChainMessage)
    )

    /**
     * This is a special type of memory specifically for conversational
     * retrieval agents.
     * It tracks intermediate steps as well as chat history up to a
     * certain number of tokens.
     *
     * The default OpenAI Functions agent prompt has a placeholder named
     * "chat_history" where history messages get injected - this is why
     * we set "memoryKey" to "chat_history". This will be made clearer
     * in a future release.
     */
    const memory = new OpenAIAgentTokenBufferMemory({
      llm: model,
      memoryKey: "chat_history",
      outputKey: "output",
      chatHistory,
    })

    const retriever = vectorstore.asRetriever()

    /**
     * Wrap the retriever in a tool to present it to the agent in a
     * usable form.
     */
    const tool = createRetrieverTool(retriever, {
      name: "search_latest_knowledge",
      description: "Searches and returns up-to-date general information.",
    })

    const executor = await initializeAgentExecutorWithOptions([tool], model, {
      agentType: "openai-functions",
      memory,
      returnIntermediateSteps: true,
      agentArgs: {
        prefix: TEMPLATE,
      },
    })

    const result = await executor.call({
      input: currentMessageContent,
    })

    if (returnIntermediateSteps) {
      return NextResponse.json(
        { output: result.output, intermediate_steps: result.intermediateSteps },
        { status: 200 }
      )
    } else {
      // Agent executors don't support streaming responses (yet!), so stream back the complete response one
      // character at a time to simluate it.
      const textEncoder = new TextEncoder()
      const fakeStream = new ReadableStream({
        async start(controller) {
          for (const character of result.output) {
            controller.enqueue(textEncoder.encode(character))
            await new Promise((resolve) => setTimeout(resolve, 20))
          }
          controller.close()
        },
      })

      return new StreamingTextResponse(fakeStream)
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
