"use client"

import dynamic from "next/dynamic"

import type { SummaryEntity } from "@/lib/types"

const Button = dynamic(
  () => import("@/components/ui/button").then((c) => c.Button),
  {
    loading: () => (
      <div className="h-9 w-40 rounded-md bg-primary animate-pulse" />
    ),
  }
)

interface Props {
  summaries: Partial<SummaryEntity>[]
}

export const DownloadButton = ({ summaries }: Props) => {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(summaries, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "knowledge-hub.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <Button
      type="button"
      onClick={handleDownload}
      className="text-sm"
      size="sm"
    >
      Download Knowledge Hub
    </Button>
  )
}
