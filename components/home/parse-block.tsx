"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

import type { Database } from "@/lib/database.types"
import type { LinkMetadata } from "@/lib/types"
import { urlRegex } from "@/lib/utils"

import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

interface Props {
  link: string
  estimate: string | null
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

  if (loading) return <ComponentSkeleton />

  if (!link || !estimate) return null

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
        <div>
          <p className="text-xs">Time to parse:</p>
          <p>{estimate}</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!isValid || saving}
          className="w-[140px] transition-all gap-1"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {errorText ? "Retry" : "Parse & Save"}
        </Button>
      </div>
      {errorText && <p className="text-red-500 text-xs">{errorText}</p>}
    </>
  )
}

const ComponentSkeleton = () => {
  return (
    <div className="flex w-full justify-between">
      <div className="grid gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-14" />
      </div>
      <Skeleton className="h-full w-[140px]" />
    </div>
  )
}
