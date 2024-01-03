import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

import { HubTable } from "./dynamic"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

interface Props {
  page: string | undefined
}

const PAGE_SIZE = 10

export const FetchedHubTable = async ({ page }: Props) => {
  const supabase = createServerSupabaseClient()

  const from =
    page && !isNaN(parseInt(page)) ? (parseInt(page) - 1) * PAGE_SIZE : 0
  const till = from + PAGE_SIZE

  const { data, error, count } = await supabase
    .from("sources")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, till)

  if (error) throw error

  return <HubTable data={data} total={count || 0} defaultPageSize={PAGE_SIZE} />
}
