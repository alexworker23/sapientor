import { cache, Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { InfoIcon } from "lucide-react"

import type { Database } from "@/lib/database.types"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
    <main className="flex min-h-screen flex-col px-16 pb-10 pt-20">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl w-max">Your Knowledge Hub</h1>
          <Popover>
            <PopoverTrigger>
              <InfoIcon className="text-slate-500 transition-opacity hover:opacity-50 mt-0.5" />
            </PopoverTrigger>
            <PopoverContent className="p-2.5">
              <p className="text-sm font-medium">
                Below you can see the inventory of your links and their
                statuses. You can download all processed links as a single file
                called Knowledge Hub and insert into any of your assistants or
                chat interfaces.
              </p>
            </PopoverContent>
          </Popover>
        </div>
        <Suspense fallback={<DownloadSummariesSkeleton />}>
          <DownloadSummaries />
        </Suspense>
      </div>
      <div className="mx-auto w-full">
        <Suspense fallback={<Skeleton className="w-full h-44" />}>
          <DataTable columns={columns} data={data} />
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
