"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

import { Database } from "@/lib/database.types"
import type { SourceEntity } from "@/lib/types"
import { decodeHtmlEntities } from "@/lib/utils"

import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "../../ui/dialog"
import { useToast } from "../../ui/use-toast"

export interface DeleteModalProps {
  isOpen: boolean
  source: Pick<SourceEntity, "id" | "title" | "icon"> | null
}

export const DeleteModal = ({ isOpen, source }: DeleteModalProps) => {
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  const handleClose = () => router.push(pathname)

  const handleDelete = async () => {
    if (!source) return

    try {
      setSubmitting(true)

      const { error } = await supabase
        .from("sources")
        .delete()
        .match({ id: source.id })
      if (error) throw new Error(error.message)

      handleClose()
      router.refresh()
      toast({
        title: "Source deleted",
        description: "The source has been deleted successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description:
          "An error occurred while deleting the source. " +
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
        <DialogHeader>Delete source</DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this source?
        </DialogDescription>
        <div className="flex gap-2 items-center w-full max-w-[280px] sm:max-w-0">
          {source?.icon && (
            <img src={source.icon} className="max-h-6" alt="website favicon" />
          )}
          <p className="font-semibold block whitespace-normal w-full">
            {decodeHtmlEntities(source?.title ?? "")}
          </p>
        </div>
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
          <Button
            type="button"
            disabled={submitting}
            onClick={handleDelete}
            className="gap-1 w-28"
          >
            {submitting && <Loader2 className="animate-spin" size={16} />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
