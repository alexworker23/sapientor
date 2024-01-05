"use client"

import { ClipboardCheckIcon } from "lucide-react"

import { useInputStore } from "@/lib/store"
import { cn } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export const PasteButton = () => {
  const { submitting, setValue } = useInputStore()
  const handlePaste = async () => {
    await navigator.clipboard.readText().then((text) => {
      if (!text.trim()) return
      setValue(text)

      const textarea = document.getElementById("textarea-input")
      if (textarea) {
        // Trigger the input event manually
        const event = new Event("input", { bubbles: true })
        textarea.dispatchEvent(event)
      }
    })
  }
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip open={submitting ? false : undefined}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handlePaste}
            className={cn(
              "cursor-pointer rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7",
              submitting ? "cursor-not-allowed opacity-50" : ""
            )}
          >
            <ClipboardCheckIcon size={16} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-slate-50">
          Paste
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
