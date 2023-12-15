import { cache } from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

import { AuthModal } from "../auth/dynamic-modal"
import { UserDisplay } from "./user-display"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export const Header = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div className="flex h-16 w-full items-center justify-between gap-x-5 bg-white/95 px-5 backdrop-blur sm:container supports-[backdrop-filter]:bg-white/60 sm:gap-x-0">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="text-lg font-bold">
            sapientor.
          </Link>
        </div>
        <div className="flex items-center gap-5">
          {!user && (
            <Link href="/about" className="hover:underline text-sm font-medium">
              About
            </Link>
          )}
          {!user && (
            <Link
              href="/tutorial"
              className="hover:underline text-sm font-medium"
            >
              Tutorial
            </Link>
          )}
          {user ? <UserDisplay user={user} /> : <AuthModal />}
        </div>
      </div>
    </header>
  )
}
