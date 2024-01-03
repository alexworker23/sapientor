"use client"

import type { SourceEntity } from "@/lib/types"
import { DataTable } from "@/components/common/data-table"

import { columns } from "./columns"

export interface HubTableProps {
  data: SourceEntity[]
  total: number
  defaultPageSize?: number
}

export const HubTable = ({ data, total, defaultPageSize }: HubTableProps) => {
  return (
    <DataTable
      data={data}
      columns={columns}
      total={total}
      defaultPageSize={defaultPageSize}
    />
  )
}
