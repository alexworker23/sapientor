"use client"

import type { LinkMetadata } from "@/lib/types"
import { decodeHtmlEntities } from "@/lib/utils"

import { Avatar, AvatarImage } from "../../ui/avatar"
import { Card, CardDescription, CardTitle } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip"

interface Props {
  metadata: LinkMetadata | null
  loading: boolean
}

export const MetadataDisplay = ({ metadata, loading }: Props) => {
  if (loading) return <MetadataDisplaySkeleton />
  if (!metadata) return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="flex p-4 items-start space-x-4 max-w-full overflow-hidden">
            <div className="flex items-center space-x-2 flex-shrink-0 mt-1">
              <Avatar className="w-6 h-6">
                <AvatarImage src={metadata.icon || "/icon.png"} />
              </Avatar>
            </div>
            <div className="space-y-1 flex-grow min-w-0">
              <CardTitle className="truncate text-xl">
                {decodeHtmlEntities(metadata.title)}
              </CardTitle>
              <CardDescription className="truncate text-sm">
                {decodeHtmlEntities(metadata.description)}
              </CardDescription>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="max-w-md">
          <div>
            <h3 className="font-semibold text-base mb-1">
              {decodeHtmlEntities(metadata.title)}
            </h3>
            <p className="text-sm">
              {decodeHtmlEntities(metadata.description)}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const MetadataDisplaySkeleton = () => {
  return (
    <Card className="flex p-4 items-start space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </Card>
  )
}
