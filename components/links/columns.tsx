"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"

import type { LinkEntity } from "@/lib/types"
import { decodeHtmlEntities } from "@/lib/utils"

export const columns: ColumnDef<LinkEntity>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        {row.original.favicon && (
          <img src={row.original.favicon} className="max-h-6" />
        )}
        <p className="max-w-[240px] truncate">
          {decodeHtmlEntities(row.getValue("title"))}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <Link href={row.getValue("url")} className="hover:underline">
        View link
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.getValue("status") && typeof row.getValue("status") === "string" ? (
        <div className="text-sm">
          {(row.getValue("status") as string).charAt(0).toUpperCase() +
            (row.getValue("status") as string).slice(1)}
        </div>
      ) : null,
  },
]
