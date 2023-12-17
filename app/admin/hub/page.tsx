import { cache, Suspense } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { Skeleton } from "@/components/ui/skeleton"
import { FetchAdminDataTable } from "@/components/admin-hub/fetch-data-table"
import { RejectModal } from "@/components/admin-hub/reject-modal"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    }
  )
})

interface Props {
  searchParams: {
    action: string | undefined
    linkId: string | undefined
  }
}

const Page = async ({ searchParams }: Props) => {
  const supabase = createServerSupabaseClient()

  const { data: targetLink } = searchParams.linkId
    ? await supabase
        .from("sources")
        .select("*")
        .eq("id", searchParams.linkId)
        .single()
    : { data: null }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 sm:px-16 pb-10 pt-20">
      <div className="mx-auto py-10 w-full">
        <Suspense
          fallback={<Skeleton className="w-full h-96 rounded-md border" />}
        >
          <FetchAdminDataTable />
        </Suspense>
      </div>
      <Suspense>
        <RejectModal
          isOpen={searchParams.action === "reject" && !!targetLink}
          link={targetLink}
        />
      </Suspense>
    </main>
  )
}

export default Page
