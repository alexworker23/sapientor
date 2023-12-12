import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { home_tab_cookie_name } from "@/lib/utils"
import { HomeUserTabs } from "@/components/home/tabs"
import { Landing } from "@/components/landing"
import { Footer } from "@/components/layout/footer"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export default async function Home() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const defaultTab = cookies().get(home_tab_cookie_name)?.value
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-16">
        {!user && <Landing />}
        {user && <HomeUserTabs defaultTab={defaultTab} />}
      </main>
      {!user && <Footer />}
    </>
  )
}
