"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import type { LinkEntity } from "@/lib/types"
import { decodeHtmlEntities } from "@/lib/utils"
import { addSummary } from "@/app/actions/add-summary"

import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"

interface Props {
  link: LinkEntity
}

export const SummaryForm = ({ link }: Props) => {
  const [submitting, setSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append("linkId", link.id)
    formData.append("userId", link.user_id)
    {link.url && formData.append("url", link.url)}
    formData.append("title", link.title ?? "")
    formData.append("description", link.description ?? "")
    try {
      setSubmitting(true)
      const { code, message } = await addSummary(formData)
      if (code !== 200) throw new Error(message)
      toast({
        title: "Success",
        description: "Summary added successfully!",
      })
      router.refresh()
      router.push("/admin/hub")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Something went wrong. " + (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="max-w-xl w-full">
      <h1 className="text-2xl mb-5">You are adding summary for</h1>
      <p className="text-sm whitespace-normal font-semibold">
        {link.icon && (
          <img
            src={link.icon}
            className="max-h-5 inline mr-1"
            alt="website favicon"
          />
        )}
        {link.url ? (
          <a href={link.url} className="hover:underline">
            {decodeHtmlEntities(link.title ?? "")}
          </a>
        ) : (
          <span>{decodeHtmlEntities(link.title ?? "")}</span>
        )}
      </p>
      <form className="mt-5" onSubmit={handleSubmit}>
        <Textarea placeholder="Summary content" name="content" id="content" />
        <div className="flex gap-2 mt-2.5 justify-end">
          <Button
            disabled={submitting}
            type="button"
            variant="outline"
            className="w-24"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button disabled={submitting} type="submit" className="w-24 gap-1">
            {submitting && <Loader2 className="animate-spin" size={16} />}
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}
