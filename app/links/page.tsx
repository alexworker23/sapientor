import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { columns } from "@/components/links/columns"
import { DataTable } from "@/components/links/data-table"

const admin_list =
  process.env.ADMIN_USERS?.split(",").map((user) => user.trim()) ?? []

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

const Page = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return redirect("/")
  if (user.email && admin_list.includes(user.email))
    return redirect("/admin/links")

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

export const metadata = {
  title: "Your Links",
}
