"use client"

import { CornerDownLeft, Loader2 } from "lucide-react"

import { useInputStore } from "@/lib/store"
import { cn } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

interface Props {
  handleSubmit: () => void
}

export const SubmitButton = ({ handleSubmit }: Props) => {
  const { submitting, value, files } = useInputStore()
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleSubmit}
            className={cn(
              "rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7",
              Boolean(value.trim()) || !!files?.length
                ? "cursor-pointer"
                : "hover:bg-transparent text-primary/40"
            )}
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CornerDownLeft size={16} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-slate-50">
          {submitting ? "Submitting..." : "Submit"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
