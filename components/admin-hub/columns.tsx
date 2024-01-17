"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { MoreHorizontal } from "lucide-react"

import type { SourceEntity } from "@/lib/types"
import { createUrl, decodeHtmlEntities } from "@/lib/utils"
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

type Entity = Pick<
  SourceEntity,
  "id" | "title" | "status" | "created_at" | "icon" | "url" | "type"
>

export const admin_columns: ColumnDef<Entity>[] = [
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
    accessorKey: "created_at",
    header: "Create At",
    cell: ({ row }) => {
      const formatted = dayjs(row.original.created_at).format(
        "DD MMM YYYY HH:mm"
      )

      return formatted
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const source = row.original
      const isLinkPending = source.status === "PENDING"

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname()
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const searchParams = useSearchParams()

      const summaryParams = new URLSearchParams(searchParams.toString())
      summaryParams.set("sourceIds", source.id)
      summaryParams.set("action", "summary")
      const summaryUrl = createUrl(pathname, summaryParams)

      const rejectParams = new URLSearchParams(searchParams.toString())
      rejectParams.set("sourceIds", source.id)
      rejectParams.set("action", "reject")
      const rejectUrl = createUrl(pathname, summaryParams)

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
              <Link prefetch href={`/admin/hub/${source.id}/add-summary`}>
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
              <Link prefetch href={summaryUrl} scroll={false}>
                <DropdownMenuItem>View summary</DropdownMenuItem>
              </Link>
            ) : null}
            {isLinkPending && (
              <Link prefetch href={rejectUrl}>
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

const parseSource = async (source: Entity) => {
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
