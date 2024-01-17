"use client"

import { DataTable } from "@/components/common/data-table"

import { columns, type HubEntity } from "./columns"

export interface HubTableProps {
  data: HubEntity[]
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
