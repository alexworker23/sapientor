"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

import type { Database } from "@/lib/database.types"
import type { SourceEntity } from "@/lib/types"
import { createUrl, decodeHtmlEntities } from "@/lib/utils"

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
  sources: Pick<SourceEntity, "id" | "title" | "icon">[] | null
}

export const DeleteModal = ({ isOpen, sources }: DeleteModalProps) => {
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const isMultipleSources = sources?.length && sources.length > 1

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete("action")
    newParams.delete("sourceId")
    router.replace(createUrl(pathname, newParams))
  }

  const supabase = createClientComponentClient<Database>()

  const handleDelete = async () => {
    if (!sources) return

    try {
      setSubmitting(true)

      const { error } = await supabase
        .from("sources")
        .delete()
        .in(
          "id",
          sources.map((source) => source.id)
        )
      if (error) throw new Error(error.message)

      const title = isMultipleSources
        ? "Sources deleted"
        : "Source deleted"

      const description = isMultipleSources
        ? `${sources.length} sources have been deleted successfully.`
        : "The source has been deleted successfully."

      handleClose()
      router.refresh()
      toast({
        title,
        description,
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
        <DialogHeader>Delete source{isMultipleSources ? "s" : ""}</DialogHeader>
        <DialogDescription>
          Are you sure you want to delete{" "}
          {isMultipleSources ? "these sources?" : "this source?"}
        </DialogDescription>
        <div className="grid gap-2.5">
          {sources?.map((source) => (
            <div key={source?.id} className="flex gap-2 items-center w-full">
              <img
                src={source?.icon || "/icon.png"}
                className="max-h-6"
                alt="website favicon"
              />
              <p className="font-semibold block whitespace-normal w-full">
                {decodeHtmlEntities(source?.title ?? "")}
              </p>
            </div>
          ))}
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
