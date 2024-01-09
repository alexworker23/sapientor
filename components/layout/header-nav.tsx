"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import useSWR from "swr"

import { Database } from "@/lib/database.types"

import { AuthModal } from "../auth/modal"
import { UserDisplay } from "./user-display"

export const HeaderNav = () => {
  const supabase = createClientComponentClient<Database>()
  const { data: user, error } = useSWR("/user/me", async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  })
  const isLoading = user === undefined && !error
  if (isLoading) return null

  return (
    <div className="flex items-center gap-5">
      {user === null && <AuthModal />}
      {user && <UserDisplay user={user} />}
    </div>
  )
}
