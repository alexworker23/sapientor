import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

import { DeleteModal } from "../modals/delete-link/dynamic"
import { ReasonModal } from "../modals/link-reason/dynamic"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

interface Props {
  linkId: string | undefined
  action: string | undefined
}

export const HubModals = async ({ linkId, action }: Props) => {
  const supabase = createServerSupabaseClient()
  const { data: targetLink } = linkId
    ? await supabase
        .from("links")
        .select("id,title,favicon,reason")
        .eq("id", linkId)
        .single()
    : { data: null }
  return (
    <>
      <DeleteModal
        isOpen={action === "delete" && !!targetLink}
        link={targetLink}
      />
      <ReasonModal
        isOpen={action === "reason" && !!targetLink}
        link={targetLink}
      />
    </>
  )
}
