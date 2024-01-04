"use client"

import { InfoIcon } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const HubInfoPopover = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <InfoIcon className="text-slate-500 transition-opacity hover:opacity-50 mt-0.5" />
      </PopoverTrigger>
      <PopoverContent className="p-2.5">
        <p className="text-sm font-medium">
          Below you can see the inventory of all the data that you have added as
          sources and their statuses.
        </p>
      </PopoverContent>
    </Popover>
  )
}
