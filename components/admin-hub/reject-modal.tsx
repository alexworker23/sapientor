"use client"

import { useState, type FormEventHandler } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import type { LinkEntity } from "@/lib/types"
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
  link: LinkEntity | null
}

export const RejectModal = ({ isOpen, link }: Props) => {
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const handleClose = () => router.push(pathname)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    if (!link) return

    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append("id", link.id)

    try {
      setSubmitting(true)

      const { code, message } = await rejectLink(formData)
      if (code !== 200) throw new Error(message)

      handleClose()
      router.refresh()
      toast({
        title: "Link rejected",
        description: "The link has been rejected successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description:
          "An error occurred while rejecting the link. " +
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
        <DialogHeader>Reject link</DialogHeader>
        <DialogDescription>
          Are you sure you want to reject this link? If yes, please provide a
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
