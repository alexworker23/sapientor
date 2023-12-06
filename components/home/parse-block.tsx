"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

import type { Database } from "@/lib/database.types"
import type { LinkEstimate, LinkMetadata } from "@/lib/types"
import { urlRegex } from "@/lib/utils"

import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

interface Props {
  link: string
  estimate: LinkEstimate | null
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
        ) : <div>
          <p className="text-xs">Time to process:</p>
          <p>~{estimate?.humanReadable}</p>
        </div>}
        <Button
          onClick={handleSave}
          disabled={!isValid || saving}
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
