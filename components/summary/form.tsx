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
      router.push("/admin/links")
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
    <div className="max-w-xl">
      <h1 className="text-2xl mb-2.5">You are adding summary for</h1>
      <p className="text-sm whitespace-normal font-semibold">
        {link.favicon && (
          <img
            src={link.favicon}
            className="max-h-5 inline mr-1"
            alt="website favicon"
          />
        )}
        <a href={link.url} className="hover:underline">
          {decodeHtmlEntities(link.title ?? "")}
        </a>
      </p>
      <form className="mt-10" onSubmit={handleSubmit}>
        <Textarea placeholder="Summary content" name="content" id="content" />
        <div className="flex gap-2 mt-2.5 justify-end">
          <Button
            disabled={submitting}
            type="button"
            variant="outline"
            className="w-24"
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
