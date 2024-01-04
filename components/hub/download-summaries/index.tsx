import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

import { DownloadButton } from "./button"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export const DownloadSummaries = async () => {
  const supabase = createServerSupabaseClient()
  const { data: summaries } = await supabase
    .from("summaries")
    .select(`created_at, content, metadata->url, metadata->title`)
    .order("created_at", { ascending: false })

  if (!summaries?.length) return null

  return (
    <div className="flex sm:justify-end w-full">
      <DownloadButton summaries={summaries ?? []} />
    </div>
  )
}
