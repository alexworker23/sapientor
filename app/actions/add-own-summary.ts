"use server"

import { cache } from "react"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Document } from "langchain/document"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

import type { Database } from "@/lib/database.types"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerActionClient<Database>({ cookies: () => cookieStore })
})

export const addOwnSummary = async (data: FormData) => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return {
      code: 401,
      message: "Unauthorized",
    }
  }

  const title = data.get("title") as string
  const description = data.get("description") as string
  const content = data.get("content") as string
  const sourceId = data.get("sourceId") as string
  const userId = data.get("userId") as string

  if (!content || !sourceId || !title || !userId) {
    return {
      code: 400,
      message: `Missing required fields: ${!content ? "content" : ""} ${
        !sourceId ? "sourceId" : ""
      } ${!title ? "title" : ""} ${!userId ? "userId" : ""}`,
    }
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
      metadata: {
        user_id: userId,
        source_id: sourceId,
        title,
        author: "user",
      },
    },
  ]

  const storedIds = await store.addDocuments(docs)

  if (storedIds.length === 0) {
    return {
      code: 500,
      message: "Internal Server Error",
    }
  }

  return {
    code: 200,
    ids: storedIds,
  }
}
