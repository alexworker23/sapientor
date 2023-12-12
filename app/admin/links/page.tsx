import { cache, Suspense } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { admin_columns } from "@/components/hub/admin-columns"
import { DataTable } from "@/components/hub/data-table"
import { RejectModal } from "@/components/hub/reject-modal"

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

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error

  const { data: targetLink } = searchParams.linkId
    ? await supabase
        .from("links")
        .select("*")
        .eq("id", searchParams.linkId)
        .single()
    : { data: null }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div className="mx-auto py-10 w-full">
        <DataTable columns={admin_columns} data={data} />
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
