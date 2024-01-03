"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

import type { Database } from "@/lib/database.types"
import type { SourceEntity } from "@/lib/types"
import { createUrl, decodeHtmlEntities } from "@/lib/utils"
import { Input } from "@/components/ui/input"

import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "../../ui/dialog"
import { useToast } from "../../ui/use-toast"

export interface EditTitleModalProps {
  isOpen: boolean
  source: Pick<SourceEntity, "id" | "title"> | null
}

export const EditTitleModal = ({ isOpen, source }: EditTitleModalProps) => {
  const [title, setTitle] = useState(source?.title ?? "")
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete("action")
    newParams.delete("sourceId")
    router.replace(createUrl(pathname, newParams))
  }

  const handleDelete = async () => {
    if (!source) return

    try {
      setSubmitting(true)

      const { error } = await supabase
        .from("sources")
        .update({
          title,
        })
        .match({ id: source.id })
      if (error) throw new Error(error.message)

      handleClose()
      router.refresh()
      toast({
        title: "Title edited",
        description: "The title of the source has been edited successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description:
          "An error occurred while editing the title. " +
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
        <DialogHeader>Update title</DialogHeader>
        <DialogDescription>
          Update source title for <b>&quot;{source?.title}&quot;</b> :
        </DialogDescription>
        <Input
          value={decodeHtmlEntities(title)}
          onChange={(e) => setTitle(e.target.value)}
          required
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
          <Button
            type="button"
            disabled={submitting}
            onClick={handleDelete}
            className="gap-1 w-28"
          >
            {submitting && <Loader2 className="animate-spin" size={16} />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
