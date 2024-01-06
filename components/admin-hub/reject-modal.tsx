"use client"

import { useState, type FormEventHandler } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import type { SourceEntity } from "@/lib/types"
import { createUrl } from "@/lib/utils"
import { rejectLink } from "@/app/actions/reject-link"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"

interface Props {
  isOpen: boolean
  source: SourceEntity | null
}

export const RejectModal = ({ isOpen, source }: Props) => {
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete("action")
    newParams.delete("sourceIds")
    router.replace(createUrl(pathname, newParams))
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    if (!source) return

    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append("id", source.id)

    try {
      setSubmitting(true)

      const { code, message } = await rejectLink(formData)
      if (code !== 200) throw new Error(message)

      handleClose()
      router.refresh()
      toast({
        title: "Link rejected",
        description: "The source has been rejected successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description:
          "An error occurred while rejecting the source. " +
          (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>Reject source</DialogHeader>
        <DialogDescription>
          Are you sure you want to reject this source? If yes, please provide a
          reason below.
        </DialogDescription>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Rejection reason..."
            name="reason"
            id="reason"
          />
          <DialogFooter className="mt-5 flex-row space-x-2 justify-end">
            <Button
              disabled={submitting}
              variant="outline"
              type="button"
              onClick={handleClose}
              className="w-28"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="gap-1 w-28">
              {submitting && <Loader2 className="animate-spin" size={16} />}
              Reject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
