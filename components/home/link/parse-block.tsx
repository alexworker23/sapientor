"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { InfoIcon, Loader2 } from "lucide-react"

import type { Database } from "@/lib/database.types"
import type { LinkMetadata, ParsingEstimate } from "@/lib/types"
import { cn, urlRegex } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

import { Button } from "../../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Skeleton } from "../../ui/skeleton"

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
          estimate,
          title: metadata?.title,
          description: metadata?.description,
          icon: metadata?.icon,
          status: notParse ? "PAUSED" : undefined,
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
        {notParse ? null : loading || !estimate ? (
          <div className="grid gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-24" />
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
                  Typically, parsing of an article takes ~10 seconds. But here
                  we display the maximum time required to parse the article, in
                  case there are some blockers on the website, or the content is
                  not a plain text, but a video for example.
                </PopoverContent>
              </Popover>
            </p>
            <p>~{estimate?.humanReadable}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Checkbox
                id="doNotParse"
                checked={notParse}
                onCheckedChange={(value) => setNotParse(!!value)}
                disabled={loading}
              />
              <label
                htmlFor="doNotParse"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Don&apos;t process the link now
              </label>
            </div>
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
