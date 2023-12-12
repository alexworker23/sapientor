"use client"

import { usePathname, useRouter } from "next/navigation"

import type { LinkEntity } from "@/lib/types"

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
  link: Pick<LinkEntity, "reason"> | null
}

export const ReasonModal = ({ isOpen, link }: ReasonModalProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleClose = () => router.push(pathname)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>Link rejection reason</DialogHeader>
        <DialogDescription>
          You link has been rejected and will not be processed. Below you can
          find the reason for rejection:
        </DialogDescription>
        <div>
          <p className="text-xl">&quot;{link?.reason}&quot;</p>
        </div>
        <DialogFooter className="mt-5">
          <Button type="button" onClick={handleClose} className="w-28">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
