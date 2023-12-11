"use client"

import type { ChangeEventHandler } from "react"
import dayjs from "dayjs"

import { useFileStore } from "@/lib/store"
import { msToHumanReadable } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

import { Input } from "../../ui/input"
import { SuccessMessage } from "../success-message"
import { FilesDisplay } from "./files-display"
import { ParseBlock } from "./parse-block"

export const FileForm = () => {
  const {
    files,
    setFiles,
    estimate,
    setEstimate,
    saveSuccess,
    setSaveSuccess,
  } = useFileStore()

  const { toast } = useToast()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files
    const arr = files ? Array.from(files) : null
    const maxFiles = 4

    if (arr && arr.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload max ${maxFiles} files`,
        variant: "destructive",
      })
      return
    }

    setFiles(arr)
    if (arr) {
      const ms = 1000 * 60 * 60 * 3 * arr.length
      setEstimate({
        time: ms,
        deadline: dayjs()
          .add(3 * arr.length, "hour")
          .toISOString(),
        humanReadable: msToHumanReadable(ms),
      })
    } else {
      setEstimate(null)
    }
  }

  if (saveSuccess) {
    return (
      <SuccessMessage type="file" handleClose={() => setSaveSuccess(false)} />
    )
  }

  const handleSuccess = () => {
    setSaveSuccess(true)
    setFiles(null)
    setEstimate(null)
  }

  return (
    <div className="grid gap-3">
      <Input
        type="file"
        className="w-full"
        onChange={handleChange}
        multiple
        accept=".pdf,.csv,.docx,.xlsx,.txt"
      />
      {!files?.length && (
        <>
          <p className="text-xs text-slate-600 -mt-1.5">
            Select files which you want to add to your Knowledge Hub.
          </p>
          <p className="text-xs text-slate-600 -mt-2.5">
            Max size - 25 MB. Max files - 4.
          </p>
        </>
      )}
      <FilesDisplay files={files} />
      <ParseBlock files={files} estimate={estimate} onSuccess={handleSuccess} />
    </div>
  )
}
