"use client"

import { useState, type ChangeEventHandler } from "react"
import dayjs from "dayjs"
import { CheckCircle, ClipboardCheckIcon } from "lucide-react"

import type { LinkMetadata } from "@/lib/types"
import { msToHumanReadable, urlRegex } from "@/lib/utils"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { MetadataDisplay } from "./metadata-display"
import { ParseBlock } from "./parse-block"

export const LinkForm = () => {
  const [link, setLink] = useState("")

  const [linkMetadata, setLinkMetadata] = useState<LinkMetadata | null>(null)
  const [linkMetadataLoading, setLinkMetadataLoading] = useState(false)

  const [estimate, setEstimate] = useState<string | null>(null)
  const [estimateLoading, setEstimateLoading] = useState(false)

  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setLink(event.target.value)
    linkMetadata && setLinkMetadata(null)
    estimate && setEstimate(null)
  }

  const handleBlur = async (url: string) => {
    const isValid = urlRegex.test(url)
    if (!isValid) return

    const isSame = url === linkMetadata?.url
    if (isSame) return

    try {
      setLinkMetadataLoading(true)
      setEstimateLoading(true)

      const metadataResponse = await fetch(`/api/metadata`, {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
      setLinkMetadata(metadataResponse)

      const estimateResponse = await fetch(`/api/estimate`, {
        method: "POST",
        body: JSON.stringify({
          url,
          title: metadataResponse.title,
          userTime: dayjs().toISOString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())

      const estimateTime = msToHumanReadable(estimateResponse.time)
      setEstimate(estimateTime)
    } catch (error) {
      console.error(error)
    } finally {
      setLinkMetadataLoading(false)
      setEstimateLoading(false)
    }
  }

  const handlePaste = async () => {
    await navigator.clipboard.readText().then((text) => {
      setLink(text)
      linkMetadata && setLinkMetadata(null)
      estimate && setEstimate(null)
      handleBlur(text)
    })
  }

  const handleSuccess = () => {
    setSaveSuccess(true)
    setLink("")
    setLinkMetadata(null)
    setEstimate(null)
  }

  if (saveSuccess) {
    return (
      <div className="animate-in slide-in-from-top-2 w-full">
        <div className="flex justify-center mb-1">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <p className="text-center mb-4">
          Link been send to the processing queue. You can check the status of
          the link in your links page.
        </p>
        <div className="flex justify-center">
          <Button type="button" onClick={() => setSaveSuccess(false)}>
            Add another link
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      <div className="relative">
        <Input
          placeholder="Paste a link"
          className="w-full"
          value={link}
          onChange={handleChange}
          onBlur={(event) => handleBlur(event.target.value)}
        />
        <div
          onClick={handlePaste}
          className="absolute right-0 top-1/2 flex h-full w-10 -translate-y-1/2 items-center justify-center bg-muted rounded-r-md cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        >
          <ClipboardCheckIcon size={18} />
        </div>
      </div>
      <MetadataDisplay metadata={linkMetadata} loading={linkMetadataLoading} />
      <ParseBlock
        link={link}
        estimate={estimate}
        metadata={linkMetadata}
        loading={estimateLoading}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
