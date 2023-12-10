"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { InfoIcon, Loader2 } from "lucide-react"

import type { Database } from "@/lib/database.types"
import type { ParsingEstimate } from "@/lib/types"

import { Button } from "../../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Skeleton } from "../../ui/skeleton"

interface Props {
  files: File[] | null
  estimate: ParsingEstimate | null
  onSuccess: () => void
}

export const ParseBlock = ({ files, estimate, onSuccess }: Props) => {
  const [saving, setSaving] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()

  if (!files || !files.length) return null

  const supabase = createClientComponentClient<Database>()
  const handleSave = async () => {
    try {
      errorText && setErrorText(null)
      setSaving(true)

      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const filePath = generateUniqueFilePath(file)
          const { error: uploadError } = await supabase.storage
            .from("files")
            .upload(filePath, file)

          if (uploadError) throw new Error(uploadError.message)

          const {
            data: { publicUrl: fileUrl },
          } = await supabase.storage.from("files").getPublicUrl(filePath)
          return {
            url: fileUrl,
            title: file.name,
          }
        })
      )

      const { data: createdEntities, error: creationError } = await supabase
        .from("links")
        .insert(
          uploadedFiles.map((file) => ({
            ...file,
            estimate,
          }))
        )
        .select("*")

      if (creationError) throw new Error(creationError.message)
      if (!createdEntities) throw new Error("Error while saving link")
      router.refresh()
      onSuccess()
    } catch (error) {
      console.error(error)
      setErrorText((error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="flex w-full justify-between">
        {!estimate ? (
          <div className="grid gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
          </div>
        ) : (
          <div>
            <p className="text-xs">
              Time to process
              <Popover>
                <PopoverTrigger asChild>
                  <InfoIcon
                    size={14}
                    className="inline ml-1 hover:opacity-50 cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent className="text-xs font-medium p-2.5">
                  Typically, parsing a single text page takes 15-20 seconds. But
                  here we display approximate time that might be required to
                  parse the document. If the document is long or has a complex
                  structure, it might take longer.
                </PopoverContent>
              </Popover>
            </p>
            <p>~{estimate?.humanReadable}</p>
          </div>
        )}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-24 transition-all gap-1"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {errorText ? "Retry" : "Submit"}
        </Button>
      </div>
      {errorText && <p className="text-red-500 text-xs">{errorText}</p>}
    </>
  )
}

const generateUniqueFilePath = (file: File) => {
  const fileExt = file.name.split(".").pop()
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15) // Random string for uniqueness
  return `${timestamp}-${randomString}.${fileExt}`
}
