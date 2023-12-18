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
  sourceId: string | undefined
  action: string | undefined
}

export const HubModals = async ({ sourceId, action }: Props) => {
  const supabase = createServerSupabaseClient()
  const { data: targetSource } = sourceId
    ? await supabase
        .from("sources")
        .select("id,title,icon,reason")
        .eq("id", sourceId)
        .single()
    : { data: null }
  return (
    <>
      <DeleteModal
        isOpen={action === "delete" && !!targetSource}
        source={targetSource}
      />
      <ReasonModal
        isOpen={action === "reason" && !!targetSource}
        source={targetSource}
      />
    </>
  )
}
