"use client"

import type { ChangeEventHandler } from "react"
import { UploadIcon } from "lucide-react"

import { useInputStore } from "@/lib/store"
import { cn } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { useToast } from "../ui/use-toast"

export const UploadButton = () => {
  const { submitting, setFiles } = useInputStore()

  const { toast } = useToast()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files
    const arr = files ? Array.from(files) : null
    const maxFiles = 3
    const maxSize = 25 * 1024 * 1024

    if (arr && arr.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload max ${maxFiles} files`,
        variant: "destructive",
      })
      return
    }

    if (arr && arr.some((file) => file.size > maxSize)) {
      toast({
        title: "File too big",
        description: `Max file size is 25 MB`,
        variant: "destructive",
      })
      return
    }
    setFiles(arr)
  }
  return (
    <TooltipProvider>
      <Tooltip open={submitting ? false : undefined}>
        <TooltipTrigger asChild>
          <label
            htmlFor="file-upload"
            tabIndex={0}
            className={cn(
              "cursor-pointer rounded-full hover:bg-slate-100 transition-colors flex justify-center items-center w-7 h-7",
              submitting ? "cursor-not-allowed opacity-50" : ""
            )}
          >
            <UploadIcon size={16} />
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleChange}
              multiple
              accept=".pdf,.csv,.docx,.txt,.md,.json"
              disabled={submitting}
            />
          </label>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-slate-50">
          Upload
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
