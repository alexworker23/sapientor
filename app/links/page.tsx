import { cache, Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { Skeleton } from "@/components/ui/skeleton"
import { columns } from "@/components/links/columns"
import { DataTable } from "@/components/links/data-table"
import { DeleteModal } from "@/components/links/delete-modal"
import { DownloadSummaries } from "@/components/links/download-summaries"
import { DownloadSummariesSkeleton } from "@/components/links/download-summaries/skeleton"
import { ReasonModal } from "@/components/links/reason-modal"

const admin_list =
  process.env.ADMIN_USERS?.split(",").map((user) => user.trim()) ?? []

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
})

interface Props {
  searchParams: {
    action: string | undefined
    linkId: string | undefined
  }
}

const Page = async ({ searchParams }: Props) => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return redirect("/")
  if (user.email && admin_list.includes(user.email))
    return redirect("/admin/links")

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
      <div className="container mx-auto py-10 max-w-3xl">
        <Suspense fallback={<Skeleton className="w-full h-44" />}>
          <DataTable columns={columns} data={data} />
        </Suspense>
        <Suspense fallback={<DownloadSummariesSkeleton />}>
          <DownloadSummaries />
        </Suspense>
      </div>
      <Suspense>
        <DeleteModal
          isOpen={searchParams.action === "delete" && !!targetLink}
          link={targetLink}
        />
      </Suspense>
      <Suspense>
        <ReasonModal
          isOpen={searchParams.action === "reason" && !!targetLink}
          link={targetLink}
        />
      </Suspense>
    </main>
  )
}

export default Page

export const metadata = {
  title: "Your Links",
}
