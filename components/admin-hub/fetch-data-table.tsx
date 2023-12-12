import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

import { admin_columns } from "./columns"
import { DataTable } from "../hub/data-table"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export const FetchAdminDataTable = async () => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error

  return <DataTable columns={admin_columns} data={data} />
}
