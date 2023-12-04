import { cache } from "react"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { columns } from "@/components/admin/links/columns"
import { DataTable } from "@/components/admin/links/data-table"

const admin_list =
  process.env.ADMIN_USERS?.split(",").map((user) => user.trim()) ?? []

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    }
  )
})

const Page = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email || !admin_list.includes(user?.email)) {
    return notFound()
  }

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div className="container mx-auto py-10 max-w-xl">
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  )
}

export default Page
