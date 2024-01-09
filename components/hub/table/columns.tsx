"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { MoreHorizontal } from "lucide-react"

import type { Database } from "@/lib/database.types"
import type { SourceEntity } from "@/lib/types"
import { createUrl, decodeHtmlEntities } from "@/lib/utils"
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
import { toast } from "@/components/ui/use-toast"
import { StatusBadge } from "@/components/common/status-badge"

export const columns: ColumnDef<SourceEntity>[] = [
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
          <Link prefetch href={row.original.url} className="max-w-md truncate">
            {decodeHtmlEntities(row.getValue("title"))}
          </Link>
        ) : (
          <span className="max-w-md truncate">
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
        <StatusBadgeWithTooltip source={row.original} />
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
      const source = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const searchParams = useSearchParams()
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathname = usePathname()

      const editParams = new URLSearchParams(searchParams.toString())
      editParams.set("sourceIds", source.id)
      editParams.set("action", "edit")
      const editUrl = createUrl(pathname, editParams)

      const deleteParams = new URLSearchParams(searchParams.toString())
      deleteParams.set("sourceIds", source.id)
      deleteParams.set("action", "delete")
      const deleteUrl = createUrl(pathname, deleteParams)

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
            {!!source.url && (
              <a href={source.url} target="_blank" rel="noreferrer, noopener">
                <DropdownMenuItem>Open</DropdownMenuItem>
              </a>
            )}
            <DropdownMenuSeparator />
            {getShowStatusForProcessButton(source) ? (
              <DropdownMenuItem onClick={() => changeSourceStatus(source)}>
                Process
              </DropdownMenuItem>
            ) : null}
            <Link prefetch href={editUrl} scroll={false}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <Link prefetch href={deleteUrl} scroll={false}>
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

const getStatusTooltip = (source: SourceEntity) => {
  switch (source.status) {
    case "REJECTED":
      return source.reason
        ? `This source was rejected because: ${source.reason}`
        : "This source was rejected without a reason"
    case "PENDING":
      return "This source is being processed and will be added to Knowledge Hub soon"
    case "COMPLETED":
      return "This source has been processed and the content has been added to Knowledge Hub"
    case "PAUSED":
      return "This source is currently not being processed. You can send it to processing by clicking on the Process button"
    default:
      return undefined
  }
}

const StatusBadgeWithTooltip = ({ source }: { source: SourceEntity }) => {
  const tooltip = getStatusTooltip(source)
  return (
    <Popover open={tooltip ? undefined : false}>
      <PopoverTrigger>
        <StatusBadge
          status={source.status}
          className={
            tooltip ? "cursor-pointer hover:opacity-60 transition-opacity" : ""
          }
        />
      </PopoverTrigger>
      <PopoverContent className="p-2.5 text-sm max-w-xs">
        {tooltip}
      </PopoverContent>
    </Popover>
  )
}

const getShowStatusForProcessButton = (source: SourceEntity) => {
  if (source.type === "LINK" && source.status === "PAUSED") {
    return true
  }

  if (
    source.type === "FILE" &&
    source.status !== "COMPLETED" &&
    source.status !== "REJECTED"
  ) {
    return true
  }

  return false
}

const changeSourceStatus = async (source: SourceEntity) => {
  const supabase = createClientComponentClient<Database>()

  try {
    if (source.status === "PAUSED") {
      const { error } = await supabase
        .from("sources")
        .update({ status: "PENDING" })
        .eq("id", source.id)
      if (error) throw new Error(error.message)
    }

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

    toast({
      title: "Source sent to processing",
      description: "The source will be processed soon",
    })

    return
  } catch (error) {
    console.error(error)
    toast({
      title: "Error",
      description: "An error occurred while processing the source",
      variant: "destructive",
    })
  }
}
