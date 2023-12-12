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
          src={row.original.favicon || "/favicon.ico"}
          className="max-h-6"
          alt="website favicon"
        />
        <p className="max-w-[300px] truncate">
          {decodeHtmlEntities(row.getValue("title"))}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.status ? <StatusBadge status={row.original.status} /> : null,
  },
  {
    accessorKey: "created",
    header: "Created",
    cell: ({ row }) => {
      return dayjs(row.original.created_at).format("MMM DD, YYYY HH:mm")
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
            {link.status === "REJECTED" && link.reason && (
              <Link href={`?linkId=${link.id}&action=reason`} scroll={false}>
                <DropdownMenuItem>View rejection reason</DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(link.url)}
            >
              Copy
            </DropdownMenuItem>
            <a href={link.url} target="_blank" rel="noreferrer, noopener">
              <DropdownMenuItem>Open</DropdownMenuItem>
            </a>
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
