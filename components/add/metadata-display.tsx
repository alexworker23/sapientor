"use client"

import { useInputStore } from "@/lib/store"
import { decodeHtmlEntities } from "@/lib/utils"

import { Avatar, AvatarImage } from "../ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export const MetadataDisplay = () => {
  const { metadata } = useInputStore()
  if (!metadata) return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex p-4 items-start space-x-4 max-w-full overflow-hidden">
            <div className="flex items-center space-x-2 flex-shrink-0 mt-1">
              <Avatar className="w-6 h-6">
                <AvatarImage src={metadata.icon || "/icon.png"} />
              </Avatar>
            </div>
            <div className="space-y-1 flex-grow min-w-0">
              <h3 className="truncate text-xl">
                {decodeHtmlEntities(metadata.title)}
              </h3>
              <p className="truncate text-sm">
                {decodeHtmlEntities(metadata.description)}
              </p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-md">
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
