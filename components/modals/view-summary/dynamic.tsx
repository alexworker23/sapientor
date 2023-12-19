"use client"

import dynamic from "next/dynamic"

import type { ViewSummaryModalProps } from "."

const Component = dynamic(() => import(".").then((c) => c.ViewSummaryModal))

export const ViewSummaryModal = (props: ViewSummaryModalProps) => (
  <Component {...props} />
)
