import { cache } from "react"
import { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { SourceInput } from "@/components/add/dynamic-input"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export const metadata: Metadata = {
  title: "add a source",
}

const Page = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return redirect("/?login=true&redirect=/add")
  return (
    <main className="min-h-screen py-24 sm:p-24">
      <SourceInput />
    </main>
  )
}

export default Page
