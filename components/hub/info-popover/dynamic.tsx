"use client"

import dynamic from "next/dynamic"

const Component = dynamic(() => import(".").then((c) => c.HubInfoPopover), {
  loading: () => (
    <div className="h-6 w-6 bg-muted animate-pulse rounded-full" />
  ),
})

export const HubInfoPopover = () => <Component />
