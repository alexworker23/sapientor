"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import type { LinkEntity } from "@/lib/types"
import { decodeHtmlEntities } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/common/status-badge"

export const admin_columns: ColumnDef<LinkEntity>[] = [
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
        <p className="max-w-[240px] truncate">
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
    id: "actions",
    cell: ({ row }) => {
      const link = row.original
      const isLinkPending = link.status === "PENDING"

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(link.url)}
            >
              Copy
            </DropdownMenuItem>
            <a href={link.url} target="_blank" rel="noreferrer, noopener">
              <DropdownMenuItem>Open</DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
            {isLinkPending && (
              <Link href={`/admin/links/${link.id}/add-summary`}>
                <DropdownMenuItem className="text-green-600">Add summary</DropdownMenuItem>
              </Link>
            )}
            {isLinkPending && (
              <Link href={`?linkId=${link.id}&action=reject`}>
                <DropdownMenuItem className="text-red-600">Reject</DropdownMenuItem>
              </Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
