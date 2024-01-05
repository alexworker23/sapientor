import { SourceInput } from "@/components/add/dynamic-input"
import { Landing } from "@/components/landing"
import { Footer } from "@/components/layout/footer"
import { Database } from "@/lib/database.types"
import { cn } from "@/lib/utils"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { cache } from "react"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export default async function Home() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <main className={cn(
        user ? "min-h-screen py-24 sm:p-24" : "flex min-h-screen flex-col items-center justify-between py-16 sm:p-16"
        )}>
        {user ? <SourceInput /> : <Landing />}
      </main>
      {!user && <Footer />}
    </>
  )
}
