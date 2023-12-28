"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import dayjs from "dayjs"
import { Loader2 } from "lucide-react"

import type { Database } from "@/lib/database.types"
import { cn } from "@/lib/utils"
import { addOwnSummary } from "@/app/actions/add-own-summary"

import { Button } from "../../ui/button"

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
        .from("sources")
        .insert({
          title: text.slice(0, 50),
          description: text,
          estimate: {
            humanReadable: "0s",
            time: 0,
            deadline: dayjs().toISOString(),
          },
          full_text: true,
        })
        .select("*")
        .single()

      if (creationError) throw new Error(creationError.message)
      if (!createdEntity) throw new Error("Error while saving text note")

      const formData = new FormData()
      formData.append("title", createdEntity.title ?? "")
      formData.append("description", createdEntity.description ?? "")
      formData.append("content", text)
      formData.append("sourceId", createdEntity.id)
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
      <div
        className={cn(
          "flex w-full gap-1",
          !text ? "justify-between" : "justify-end"
        )}
      >
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
