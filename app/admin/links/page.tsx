import { cache, Suspense } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { DataTable } from "@/components/links/data-table"
import { RejectModal } from "@/components/links/reject-modal"
import { admin_columns } from "@/components/links/admin-columns"

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
      <div className="container mx-auto py-10 max-w-xl">
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
