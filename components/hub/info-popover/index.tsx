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
          Below you can see the inventory of your links and their statuses. You
          can download all processed links as a single file called Knowledge Hub
          and insert into any of your assistants or chat interfaces.
        </p>
      </PopoverContent>
    </Popover>
  )
}
