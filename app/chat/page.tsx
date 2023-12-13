import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { Chat } from "@/components/chat/dynamic"

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
  return (
    <main className="flex min-h-screen flex-col pb-10 pt-20 px-4 sm:px-16">
      <div className="max-w-xl mx-auto w-full">
        <Chat />
      </div>
    </main>
  )
}

export default Page
