"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { MoreHorizontal } from "lucide-react"

import type { LinkEntity } from "@/lib/types"
import { decodeHtmlEntities } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { StatusBadge } from "@/components/common/status-badge"

export const columns: ColumnDef<LinkEntity>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <img
          src={row.original.icon || "/icon.png"}
          className="max-h-6"
          alt="website favicon"
        />
        {row.original.url?.startsWith("http") ? (
          <Link href={row.original.url} className="max-w-[300px] truncate">
            {decodeHtmlEntities(row.getValue("title"))}
          </Link>
        ) : (
          <span className="max-w-[300px] truncate">
            {decodeHtmlEntities(row.getValue("title"))}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.status ? (
        <StatusBadgeWithTooltip link={row.original} />
      ) : null,
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => {
      return (
        <div className="w-max">
          {dayjs(row.original.created_at).format("MMM DD, YYYY HH:mm")}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const link = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {!!link.url && 
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(link.url!)}
            >
              Copy
            </DropdownMenuItem>}
            {!!link.url && 
            <a href={link.url} target="_blank" rel="noreferrer, noopener">
              <DropdownMenuItem>Open</DropdownMenuItem>
            </a>}
            <DropdownMenuSeparator />
            <Link href={`?linkId=${link.id}&action=delete`} scroll={false}>
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const getStatusTooltip = (link: LinkEntity) => {
  switch (link.status) {
    case "REJECTED":
      return link.reason
        ? `This link was rejected because: ${link.reason}`
        : "This link was rejected without a reason"
    case "PENDING":
      return "This link is being processed and will be added to Knowledge Hub soon"
    case "COMPLETED":
      return "This link has been processed and the content has been added to Knowledge Hub"
    default:
      return undefined
  }
}

const StatusBadgeWithTooltip = ({ link }: { link: LinkEntity }) => {
  const tooltip = getStatusTooltip(link)
  return (
    <Popover open={tooltip ? undefined : false}>
      <PopoverTrigger asChild>
        <StatusBadge
          status={link.status}
          className={
            tooltip ? "cursor-pointer hover:opacity-60 transition-opacity" : ""
          }
        />
      </PopoverTrigger>
      <PopoverContent className="p-2.5 text-sm">{tooltip}</PopoverContent>
    </Popover>
  )
}
