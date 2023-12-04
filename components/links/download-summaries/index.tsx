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
    .select("content")
    .order("created_at", { ascending: false })
  if (!summaries?.length) return null

  return (
    <div className="flex justify-end w-full mt-2.5">
      <DownloadButton summaries={summaries ?? []} />
    </div>
  )
}
