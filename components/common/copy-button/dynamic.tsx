"use client"

import dynamic from "next/dynamic"

import type { CopyButtonProps } from "."

const Component = dynamic<CopyButtonProps>(
  () => import(".").then((c) => c.CopyButton),
  {
    loading: () => (
      <div className="h-9 w-24 rounded-md bg-primary animate-pulse" />
    ),
  }
)

export const CopyButton = (props: CopyButtonProps) => <Component {...props} />
