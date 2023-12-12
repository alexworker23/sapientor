import { cache, type ReactNode } from "react"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

const admin_list =
  process.env.ADMIN_USERS?.split(",").map((user) => user.trim()) ?? []

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

// @ts-ignore
export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email || !admin_list.includes(user?.email)) return notFound()

  return children
}
