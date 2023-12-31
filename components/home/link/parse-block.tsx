"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import dayjs from "dayjs"
import { Loader2, Settings } from "lucide-react"

import type { Database } from "@/lib/database.types"
import type { LinkMetadata, ParsingEstimate } from "@/lib/types"
import { cn, urlRegex } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"

interface Props {
  link: string
  estimate: ParsingEstimate | null
  metadata: LinkMetadata | null
  loading: boolean
  onSuccess: () => void
}

export const ParseBlock = ({
  link,
  estimate,
  metadata,
  loading,
  onSuccess,
}: Props) => {
  const [notParse, setNotParse] = useState(false)
  // const [saveFullText, setSaveFullText] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)

  const isValid = urlRegex.test(link)
  const router = useRouter()

  if (!link || !metadata) return null

  const supabase = createClientComponentClient<Database>()

  const handleSave = async () => {
    try {
      errorText && setErrorText(null)
      setSaving(true)

      const { data: createdEntity, error: creationError } = await supabase
        .from("sources")
        .insert({
          url: link,
          estimate: estimate || {
            time: 3600000,
            humanReadable: "1hr",
            deadline: dayjs().add(1, "hour").toISOString(),
          },
          title: metadata?.title,
          description: metadata?.description,
          icon: metadata?.icon,
          status: notParse ? "PAUSED" : undefined,
          full_text: true,
          type: "LINK",
        })
        .select("*")
        .single()

      if (creationError) throw new Error(creationError.message)
      if (!createdEntity) throw new Error("Error while saving link")

      if (!notParse) {
        fetch("/api/parse/link", {
          method: "POST",
          body: JSON.stringify({ source_id: createdEntity.id }),
        })
      }

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
      <div className={cn("flex w-full justify-between")}>
        {loading || !estimate ? (
          <div className="grid gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-5 w-5 rounded-full" />
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
                  {/* <div className="flex items-center gap-2.5">
                    <Switch
                      id="save-full-text"
                      checked={saveFullText}
                      onCheckedChange={(value) => setSaveFullText(value)}
                      className="w-9 h-5"
                      thumbClass="w-4 h-4 data-[state=checked]:translate-x-4"
                    />
                    <Label htmlFor="save-full-text" className="text-xs">
                      Save Full Text
                    </Label>
                  </div> */}
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
          disabled={!isValid || saving || loading}
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
