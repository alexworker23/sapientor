"use client"

import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import useSWR from "swr"

import { Database } from "@/lib/database.types"

import { AuthModal } from "../auth/modal"
import { UserDisplay } from "./user-display"

export const HeaderNav = () => {
  const supabase = createClientComponentClient<Database>()
  const { data: user, isLoading } = useSWR("/user/me", async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  })
  if (isLoading) return null

  return (
    <div className="flex items-center gap-5">
      {!user && (
        <Link href="/about" className="hover:underline text-sm font-medium">
          About
        </Link>
      )}
      {!user && (
        <Link href="/tutorial" className="hover:underline text-sm font-medium">
          Tutorial
        </Link>
      )}
      {user ? <UserDisplay user={user} /> : <AuthModal />}
    </div>
  )
}
