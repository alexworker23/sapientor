"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import dayjs from "dayjs"
import { Loader2 } from "lucide-react"

import type { Database } from "@/lib/database.types"
import { addOwnSummary } from "@/app/actions/add-own-summary"

import { Button } from "../../ui/button"

// import { addSummary } from "@/app/actions/add-summary"

interface Props {
  text: string
  onSuccess: () => void
}

export const ParseBlock = ({ text, onSuccess }: Props) => {
  const [saving, setSaving] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()
  const handleSave = async () => {
    try {
      errorText && setErrorText(null)
      setSaving(true)

      const { data: createdEntity, error: creationError } = await supabase
        .from("links")
        .insert({
          url: "#user-text",
          title: text.slice(0, 50),
          description: text,
          estimate: {
            humanReadable: "0s",
            time: 0,
            deadline: dayjs().toISOString(),
          },
        })
        .select("*")
        .single()

      if (creationError) throw new Error(creationError.message)
      if (!createdEntity) throw new Error("Error while saving link")

      const formData = new FormData()
      formData.append("url", "#user-text")
      formData.append("title", createdEntity.title ?? "")
      formData.append("description", createdEntity.description ?? "")
      formData.append("content", text)
      formData.append("linkId", createdEntity.id)
      formData.append("userId", createdEntity.user_id)

      const { code, message } = await addOwnSummary(formData)
      if (code !== 200) throw new Error(message)

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
      <div className="flex w-full justify-between gap-1">
      {!text && (
        <p className="text-xs text-slate-600 -mt-1.5">
          Input text you want to add to Knowledge Hub.
        </p>
      )}
        <Button
          onClick={handleSave}
          disabled={saving || !text}
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
