"use client"

import { usePathname, useRouter } from "next/navigation"

import type { SourceEntity } from "@/lib/types"

import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "../../ui/dialog"

export interface ReasonModalProps {
  isOpen: boolean
  source: Pick<SourceEntity, "reason"> | null
}

export const ReasonModal = ({ isOpen, source }: ReasonModalProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleClose = () => router.push(pathname)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>Source rejection reason</DialogHeader>
        <DialogDescription>
          You source has been rejected and will not be processed. Below you can
          find the reason for rejection:
        </DialogDescription>
        <div>
          <p className="text-xl">&quot;{source?.reason}&quot;</p>
        </div>
        <DialogFooter className="mt-5 flex-row space-x-2 justify-end">
          <Button type="button" onClick={handleClose} className="w-28">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
