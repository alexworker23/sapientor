"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { createUrl } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "../ui/button"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  total?: number
  defaultPageSize?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total = 0,
  defaultPageSize = 10,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageString = searchParams.get("page")
  const pageSizeString = searchParams.get("pageSize")

  const page =
    pageString && !isNaN(parseInt(pageString)) ? parseInt(pageString) : 1
  const pageSize =
    pageSizeString && !isNaN(parseInt(pageSizeString))
      ? parseInt(pageSizeString)
      : defaultPageSize

  const totalPages = Math.ceil(total / pageSize)
  const prevPageDisabled = page <= 1
  const nextPageDisabled = page >= totalPages

  const handlePrevPage = () => {
    const newPage = page - 1
    if (newPage < 1) return

    const newParams = new URLSearchParams(searchParams.toString())
    if (newPage === 1) {
      newParams.delete("page")
    } else {
      newParams.set("page", newPage.toString())
    }
    router.replace(createUrl(pathname, newParams), { scroll: false })
  }

  const handleNextPage = () => {
    const newPage = page + 1
    if (newPage > totalPages) return

    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("page", newPage.toString())
    router.replace(createUrl(pathname, newParams), { scroll: false })
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: defaultPageSize } },
  })

  const handleDeleteClick = () => {
    const sources = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original)
    const ids = sources.map((source) => (source as any).id as string)

    const deleteParams = new URLSearchParams(searchParams.toString())
    deleteParams.set("sourceIds", ids.join(","))
    deleteParams.set("action", "delete")
    const deleteUrl = createUrl(pathname, deleteParams)

    router.push(deleteUrl, { scroll: false })
    table.resetRowSelection()
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {total} row(s)
          selected.
        </div>
        <div className="space-x-2">
          {!!table.getFilteredSelectedRowModel().rows.length && (
            <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
              Delete {table.getFilteredSelectedRowModel().rows.length} row(s)
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={prevPageDisabled}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={nextPageDisabled}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
