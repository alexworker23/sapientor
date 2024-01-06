import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

import { DeleteModal } from "../modals/delete-link/dynamic"
import { EditSourceModal } from "../modals/edit-source/dynamic"
import { ReasonModal } from "../modals/link-reason/dynamic"
import { ViewSummaryModal } from "../modals/view-summary/dynamic"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

interface Props {
  sourceIds: string | undefined
  action: string | undefined
}

export const HubModals = async ({ sourceIds, action }: Props) => {
  const supabase = createServerSupabaseClient()
  const ids = sourceIds?.split(",")

  const { data: sources } = ids
    ? await supabase
        .from("sources")
        .select("id,title,icon,reason")
        .in("id", ids)
    : { data: null }

  const { data: summaries } =
    action === "summary" && sources?.at(0)?.id
      ? await supabase
          .from("summaries")
          .select("content")
          .eq("metadata->>source_id", sources.at(0)?.id!)
      : { data: null }
  return (
    <>
      <DeleteModal
        isOpen={action === "delete" && !!sources?.length}
        sources={sources}
      />
      <ReasonModal
        isOpen={action === "reason" && !!sources?.length}
        source={sources?.at(0) || null}
      />
      <ViewSummaryModal
        isOpen={action === "summary" && !!sources && !!summaries?.length}
        title={sources?.at(0)?.title ?? ""}
        summaries={summaries?.map((summary) => summary.content) ?? null}
      />
      <EditSourceModal
        isOpen={action === "edit" && !!sources?.length}
        source={sources?.at(0) || null}
      />
    </>
  )
}
