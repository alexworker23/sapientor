import { cache } from "react"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"

import type { Database } from "@/lib/database.types"

import { parseFileToDocuments } from "./utils"
import { splitDocuments } from "@/lib/utils"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
})

export async function POST(req: Request) {
  const { source_id } = await req.json()

  if (!source_id) {
    return new Response(
      JSON.stringify({ error: "Source ID was not provided" }),
      {
        status: 400,
      }
    )
  }

  const supabase = createServerSupabaseClient()
  const { data: source } = await supabase
    .from("sources")
    .select("*")
    .eq("id", source_id)
    .single()

  if (!source || !source.url)
    return new Response(JSON.stringify({ error: "Source not found" }), {
      status: 404,
    })

  const { data: file } = await supabase.storage
    .from("files")
    .download(source.url)

  if (!file)
    return new Response(JSON.stringify({ error: "File not found" }), {
      status: 404,
    })

  const embeddings = new OpenAIEmbeddings()
  const store = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: "summaries",
  })

  const documents = await parseFileToDocuments(file, source)
  const splitDocs = splitDocuments(documents)
  const storedIds = await store.addDocuments(splitDocs)

  await supabase.from("notifications").insert({
    title: "Your summary is ready!",
    description: `Your summary for "${source.title!.slice(0, 50)}${
      source.title!.length > 50 ? "..." : ""
    }" is done and is already added to your Knowledge Hub`,
    user_id: source.user_id,
  })

  return new Response(JSON.stringify({ ids: storedIds }), {
    status: 200,
  })
}
