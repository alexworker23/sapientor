"use client"

import type { SummaryEntity } from "@/lib/types"
import { Button } from "@/components/ui/button"

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
    link.download = "data.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  return (
    <Button type="button" onClick={handleDownload}>
      Download All Summaries
    </Button>
  )
}
