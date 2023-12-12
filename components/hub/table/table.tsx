"use client"

import type { LinkEntity } from "@/lib/types"
import { DataTable } from "@/components/common/data-table"

import { columns } from "./columns"

export interface HubTableProps {
  data: LinkEntity[]
}

export const HubTable = ({ data }: HubTableProps) => {
  return <DataTable data={data} columns={columns} />
}
