import { cache } from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

const admin_list =
  process.env.ADMIN_USERS?.split(",").map((user) => user.trim()) ?? []

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return redirect("/")
  if (user.email && admin_list.includes(user.email))
    return redirect("/admin/hub")

  return children
}

export const metadata: Metadata = {
  title: "Knowledge Hub",
}
