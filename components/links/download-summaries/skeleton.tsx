import { Skeleton } from "@/components/ui/skeleton"

export const DownloadSummariesSkeleton = () => {
  return (
    <div className="flex justify-end w-full mt-4">
      <Skeleton className="h-10 w-48" />
    </div>
  )
}
