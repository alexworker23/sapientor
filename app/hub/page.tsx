import { Suspense } from "react"
import { InfoIcon } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { DownloadSummaries } from "@/components/hub/download-summaries"
import { DownloadSummariesSkeleton } from "@/components/hub/download-summaries/skeleton"
import { FetchDataTable } from "@/components/hub/fetch-data-table"
import { HubModals } from "@/components/hub/modals"

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
        <Suspense
          fallback={<Skeleton className="w-full h-96 rounded-md border" />}
        >
          <FetchDataTable />
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
