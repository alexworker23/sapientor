"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { InfoIcon, Loader2 } from "lucide-react"

import type { Database } from "@/lib/database.types"
import type { LinkMetadata, ParsingEstimate } from "@/lib/types"
import { urlRegex } from "@/lib/utils"

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
        .from("links")
        .insert({
          url: link,
          estimate,
          title: metadata?.title,
          description: metadata?.description,
          favicon: metadata?.favicon,
        })
        .select("*")
        .single()

      if (creationError) throw new Error(creationError.message)
      if (!createdEntity) throw new Error("Error while saving link")

      // @todo disable for launch
      fetch("/api/parse/link", {
        method: "POST",
        body: JSON.stringify({ link_id: createdEntity.id }),
      })

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
        {loading || !estimate ? (
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
                  Typically, parsing of an article takes ~10 seconds. But here
                  we display the maximum time required to parse the article, in
                  case there are some blockers on the website, or the content is
                  not a plain text, but a video for example.
                </PopoverContent>
              </Popover>
            </p>
            <p>~{estimate?.humanReadable}</p>
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
