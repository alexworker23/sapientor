import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

import { DeleteModal } from "../modals/delete-link/dynamic"
import { ReasonModal } from "../modals/link-reason/dynamic"
import { ViewSummaryModal } from "../modals/view-summary/dynamic"

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
  const { data: source } = sourceId
    ? await supabase
        .from("sources")
        .select("id,title,icon,reason")
        .eq("id", sourceId)
        .single()
    : { data: null }
  const { data: summaries } = action === 'summary' && sourceId 
    ? await supabase.from('summaries').select('content').eq('metadata->>source_id', sourceId)
    : { data: null}
  return (
    <>
      <DeleteModal
        isOpen={action === "delete" && !!source}
        source={source}
      />
      <ReasonModal
        isOpen={action === "reason" && !!source}
        source={source}
      />
      <ViewSummaryModal 
        isOpen={action === "summary" && !!source && !!summaries?.length}
        title={source?.title ?? ''}
        summaries={summaries?.map(summary => summary.content) ?? null}
      />
    </>
  )
}
