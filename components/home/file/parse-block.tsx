"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2, Settings } from "lucide-react"

import type { Database } from "@/lib/database.types"
import type { ParsingEstimate } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"

import { Button } from "../../ui/button"
import { Skeleton } from "../../ui/skeleton"

interface Props {
  files: File[] | null
  estimate: ParsingEstimate | null
  onSuccess: () => void
}

export const ParseBlock = ({ files, estimate, onSuccess }: Props) => {
  const [notParse, setNotParse] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()

  if (!files || !files.length) return null

  const supabase = createClientComponentClient<Database>()
  const handleSave = async () => {
    try {
      errorText && setErrorText(null)
      setSaving(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User is not authenticated")

      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const filePath = generateUniqueFilePath(file, user.id)
          const { error: uploadError } = await supabase.storage
            .from("files")
            .upload(filePath, file)

          if (uploadError) throw new Error(uploadError.message)

          return {
            url: filePath,
            title: file.name,
          }
        })
      )

      const sources_to_insert: Database["public"]["Tables"]["sources"]["Insert"][] =
        uploadedFiles.map((file) => ({
          ...file,
          estimate,
          status: notParse ? "PAUSED" : undefined,
          full_text: true,
          type: "FILE",
        }))

      const { data: createdEntities, error: creationError } = await supabase
        .from("sources")
        .insert(sources_to_insert)
        .select("*")

      if (creationError) throw new Error(creationError.message)
      if (!createdEntities) throw new Error("Error while saving file")

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
          <div className="grid gap-1">
            <p className="text-xs font-semibold">Settings</p>
            <Popover>
              <PopoverTrigger>
                <Settings
                  size={20}
                  className="transition-opacity hover:opacity-50"
                />
              </PopoverTrigger>
              <PopoverContent className="p-2.5 max-w-xs">
                <div
                  className={cn(
                    "grid gap-2.5",
                    notParse ? "" : "mb-2.5 border-b pb-2.5"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Switch
                      id="do-not-parse"
                      checked={notParse}
                      onCheckedChange={(value) => setNotParse(value)}
                      className="w-9 h-5"
                      thumbClass="w-4 h-4 data-[state=checked]:translate-x-4"
                    />
                    <Label htmlFor="do-not-parse" className="text-xs">
                      Process Later
                    </Label>
                  </div>
                </div>
                {!notParse && (
                  <p className="text-xs">
                    Max time to process: <b>{estimate?.humanReadable}</b>
                  </p>
                )}
              </PopoverContent>
            </Popover>
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

const generateUniqueFilePath = (file: File, user_id: string) => {
  const fileExt = file.name.split(".").pop()

  const timestamp = Date.now()

  const randomString = Math.random().toString(36).substring(2, 15) // Random string for uniqueness

  return `${user_id}/${timestamp}-${randomString}.${fileExt}`
}
