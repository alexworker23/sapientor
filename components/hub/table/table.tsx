"use client"

import type { SourceEntity } from "@/lib/types"
import { DataTable } from "@/components/common/data-table"

import { columns } from "./columns"

export interface HubTableProps {
  data: SourceEntity[]
}

export const HubTable = ({ data }: HubTableProps) => {
  return <DataTable data={data} columns={columns} />
}
