import { cache } from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/lib/database.types"

import { AuthModal } from "../auth/dynamic-modal"
import { Button } from "../ui/button"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

export const GetStartedButton = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return (
      <Link href="/add">
        <Button className="text-sm">Get Started</Button>
      </Link>
    )
  }

  return (
    <AuthModal
      buttonLabel="Get Started"
      variant="default"
      className="text-sm"
      size="default"
    />
  )
}
