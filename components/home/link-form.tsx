"use client"

import { useState, type ChangeEventHandler } from "react"
import { ClipboardCheckIcon } from "lucide-react"

import { urlRegex } from "@/lib/utils"

import { Input } from "../ui/input"
import { MetadataDisplay } from "./metadata-display"
import { ParseBlock } from "./parse-block"

export const LinkForm = () => {
  const [link, setLink] = useState("")
  const [linkMetadata, setLinkMetadata] = useState(null)
  const [linkMetadataLoading, setLinkMetadataLoading] = useState(false)
  const [estimate, setEstimate] = useState<string | null>(null)
  const [estimateLoading, setEstimateLoading] = useState(false)

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setLink(e.target.value)
    linkMetadata && setLinkMetadata(null)
    estimate && setEstimate(null)
  }

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      setLink(text)
    })
  }

  const handleBlur = async () => {
    const isValid = urlRegex.test(link)
    if (!isValid) return
    try {
      setLinkMetadataLoading(true)
      setEstimateLoading(true)
      const res = await fetch(`/api/metadata`, {
        method: "POST",
        body: JSON.stringify({ url: link }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
      setLinkMetadata(res)
      setTimeout(() => {
        setEstimate("1hr")
        setEstimateLoading(false)
      }, 1000)
    } catch (error) {
      console.error(error)
    } finally {
      setLinkMetadataLoading(false)
    }
  }

  return (
    <div className="grid gap-3">
      <div className="relative">
        <Input
          placeholder="Paste a link"
          className="w-full"
          value={link}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div
          onClick={handlePaste}
          className="absolute right-0 top-1/2 flex h-full w-10 -translate-y-1/2 items-center justify-center bg-muted rounded-r-md transition-opacity hover:opacity-70 cursor-pointer"
        >
          <ClipboardCheckIcon size={18} className="text-muted-foreground" />
        </div>
      </div>
      <MetadataDisplay metadata={linkMetadata} loading={linkMetadataLoading} />
      <ParseBlock link={link} estimate={estimate} loading={estimateLoading} />
    </div>
  )
}
