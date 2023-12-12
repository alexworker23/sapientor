import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { DownloadSummaries } from "@/components/hub/download-summaries"
import { DownloadSummariesSkeleton } from "@/components/hub/download-summaries/skeleton"
import { HubInfoPopover } from "@/components/hub/info-popover/dynamic"
import { HubModals } from "@/components/hub/modals"
import { FetchedHubTable } from "@/components/hub/table/fetched"

interface Props {
  searchParams: {
    action: string | undefined
    linkId: string | undefined
  }
}

const Page = async ({ searchParams }: Props) => {
  return (
    <main className="flex min-h-screen flex-col px-16 pb-10 pt-20">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl w-max">Your Knowledge Hub</h1>
          <HubInfoPopover />
        </div>
        <Suspense fallback={<DownloadSummariesSkeleton />}>
          <DownloadSummaries />
        </Suspense>
      </div>
      <div className="mx-auto w-full">
        <Suspense
          fallback={<Skeleton className="w-full h-96 rounded-md border" />}
        >
          <FetchedHubTable />
        </Suspense>
      </div>
      <Suspense
        key={`${searchParams.action}-${searchParams.linkId}`}
        fallback={<></>}
      >
        <HubModals linkId={searchParams.linkId} action={searchParams.action} />
      </Suspense>
    </main>
  )
}

export default Page
