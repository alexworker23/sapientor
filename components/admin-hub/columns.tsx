"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { MoreHorizontal } from "lucide-react"

import type { ParsingEstimate, SourceEntity } from "@/lib/types"
import { cn, decodeHtmlEntities } from "@/lib/utils"
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

import { toast } from "../ui/use-toast"

export const admin_columns: ColumnDef<SourceEntity>[] = [
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
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => {
      const formatted = dayjs(
        (row.original.estimate as ParsingEstimate).deadline
      ).format("DD MMM YYYY HH:mm")
      const isOverdue = dayjs().isAfter(formatted)
      const isComplete = row.original.status !== "PENDING"

      return (
        <div
          className={cn(
            isComplete
              ? "text-green-600"
              : isOverdue
                ? "text-red-600 font-medium"
                : "font-semibold"
          )}
        >
          {formatted}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const source = row.original
      const isLinkPending = source.status === "PENDING"

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
            {!!source.url && (
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(source.url!)}
              >
                Copy
              </DropdownMenuItem>
            )}
            {source.url ? (
              <a href={source.url} target="_blank" rel="noreferrer, noopener">
                <DropdownMenuItem>Open</DropdownMenuItem>
              </a>
            ) : (
              <span>{source.url}</span>
            )}
            {isLinkPending && <DropdownMenuSeparator />}
            {isLinkPending && (
              <Link href={`/admin/hub/${source.id}/add-summary`}>
                <DropdownMenuItem className="text-green-600">
                  Add summary
                </DropdownMenuItem>
              </Link>
            )}
            {isLinkPending && (
              <DropdownMenuItem
                className="text-green-600"
                onClick={() => parseSource(row.original)}
              >
                Auto-parse
              </DropdownMenuItem>
            )}
            {source.status === "COMPLETED" ? (
              <Link
                href={`?sourceId=${source.id}&action=summary`}
                scroll={false}
              >
                <DropdownMenuItem>View summary</DropdownMenuItem>
              </Link>
            ) : null}
            {isLinkPending && (
              <Link href={`?sourceId=${source.id}&action=reject`}>
                <DropdownMenuItem className="text-red-600">
                  Reject
                </DropdownMenuItem>
              </Link>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const parseSource = async (source: SourceEntity) => {
  try {
    if (source.type === "LINK") {
      fetch("/api/parse/link", {
        method: "POST",
        body: JSON.stringify({ source_id: source.id }),
      })
    }

    if (source.type === "FILE") {
      fetch("/api/parse/file", {
        method: "POST",
        body: JSON.stringify({ source_id: source.id }),
      })
    }

    return toast({
      title: "Source sent to processing",
      description: "The source will be processed soon",
    })
  } catch (error) {
    console.error(error)
  }
}
