import { urlRegex } from "@/lib/utils"

import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

interface Props {
  link: string
  estimate: string | null
  loading: boolean
}

export const ParseBlock = ({ link, estimate, loading }: Props) => {
  const isValid = urlRegex.test(link)

  if (loading) return <ComponentSkeleton />

  if (!link || !estimate) return null

  return (
    <div className="flex w-full justify-between">
      <div>
        <p className="text-xs">Time to parse:</p>
        <p>{estimate}</p>
      </div>
      <Button disabled={!isValid} className="w-[140px] transition-all">
        Save link
      </Button>
    </div>
  )
}

const ComponentSkeleton = () => {
  return (
    <div className="flex w-full justify-between">
      <div className="grid gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-14" />
      </div>
      <Skeleton className="h-full w-[140px]" />
    </div>
  )
}
