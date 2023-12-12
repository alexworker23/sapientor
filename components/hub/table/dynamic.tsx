"use client"

import dynamic from "next/dynamic"

import type { HubTableProps } from "./table"

const Component = dynamic(() => import("./table").then((c) => c.HubTable))

export const HubTable = ({ data }: HubTableProps) => <Component data={data} />
