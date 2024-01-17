import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

import { DataTable } from "../common/data-table"
import { admin_columns } from "./columns"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

interface Props {
  page: string | undefined
}

const PAGE_SIZE = 10

export const FetchAdminDataTable = async ({ page }: Props) => {
  const supabase = createServerSupabaseClient()

  const from =
    page && !isNaN(parseInt(page)) ? (parseInt(page) - 1) * PAGE_SIZE : 0
  const till = from + PAGE_SIZE

  const { data, error, count } = await supabase
    .from("sources")
    .select("id, title, status, created_at, url, icon, type", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, till)

  if (error) throw error

  return (
    <DataTable
      columns={admin_columns}
      data={data}
      total={count ?? 0}
      defaultPageSize={PAGE_SIZE}
    />
  )
}
