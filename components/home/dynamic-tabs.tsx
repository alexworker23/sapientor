"use client"

import dynamic from "next/dynamic"

import type { HomeUserTabsProps } from "./tabs"

const Component = dynamic(
  () => import("./tabs").then((mod) => mod.HomeUserTabs),
  {
    loading: () => (
      <div className="w-[280px] h-10 bg-muted rounded-md animate-pulse" />
    ),
  }
)

export const HomeUserTabs = (props: HomeUserTabsProps) => (
  <Component {...props} />
)
