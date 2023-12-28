"use client"

import { useEffect, type ChangeEventHandler } from "react"
import dayjs from "dayjs"
import { ClipboardCheckIcon } from "lucide-react"

import { useDebounce } from "@/lib/hooks"
import { useLinkStore } from "@/lib/store"
import type { ParsingEstimate } from "@/lib/types"
import { msToHumanReadable, urlRegex } from "@/lib/utils"

import { Input } from "../../ui/input"
import { SuccessMessage } from "../success-message"
import { MetadataDisplay } from "./metadata-display"
import { ParseBlock } from "./parse-block"

export const LinkForm = () => {
  const {
    link,
    setLink,
    metadata,
    setMetadata,
    metadataLoading,
    setMetadataLoading,
    estimate,
    setEstimate,
    estimateLoading,
    setEstimateLoading,
    saveSuccess,
    setSaveSuccess,
  } = useLinkStore()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setLink(event.target.value)
    metadata && setMetadata(null)
    estimate && setEstimate(null)
  }

  const getMetadata = async (url: string) => {
    try {
      setMetadataLoading(true)
      const response = await fetch(`/api/metadata`, {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
      setMetadata(response)
      return response
    } catch (error) {
      console.error(error)
    } finally {
      setMetadataLoading(false)
    }
  }

  const getEstimate = async (url: string, title: string) => {
    try {
      setEstimateLoading(true)

      const response = (await fetch(`/api/estimate`, {
        method: "POST",
        body: JSON.stringify({
          url,
          title,
          userTime: dayjs().toISOString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())) as
        | Omit<ParsingEstimate, "humanReadable" | "deadline">
        | undefined
      if (!response) return

      const deadline = dayjs().add(response.time, "ms").toISOString()
      const humanReadable = msToHumanReadable(response.time)

      setEstimate({ ...response, humanReadable, deadline })
    } catch (error) {
      console.error(error)
    } finally {
      setEstimateLoading(false)
    }
  }

  const fetchLinkData = async (url: string) => {
    const isValid = urlRegex.test(url)
    if (!isValid) return

    const isSame = url === metadata?.url
    if (isSame) return

    try {
      const metadataResponse = await getMetadata(url)
      await getEstimate(url, metadataResponse.title)
    } catch (error) {
      console.error(error)
    }
  }

  const debouncedLink = useDebounce(link, 50)
  useEffect(() => {
    fetchLinkData(debouncedLink)
  }, [debouncedLink])

  const handlePaste = async () => {
    await navigator.clipboard.readText().then((text) => {
      if (!text.trim()) return
      setLink(text)
      metadata && setMetadata(null)
      estimate && setEstimate(null)
      fetchLinkData(text)
    })
  }

  const handleSuccess = () => {
    setSaveSuccess(true)
    setLink("")
    setMetadata(null)
    setEstimate(null)
  }

  if (saveSuccess) {
    return (
      <SuccessMessage type="link" handleClose={() => setSaveSuccess(false)} />
    )
  }

  const isValidLink = urlRegex.test(link)

  return (
    <div className="grid gap-3">
      <div className="relative">
        <Input
          placeholder="Paste a link"
          className="w-full"
          value={link}
          onChange={handleChange}
          onBlur={(event) => fetchLinkData(event.target.value)}
        />
        <div
          onClick={handlePaste}
          className="absolute right-0 top-1/2 flex h-full w-10 -translate-y-1/2 items-center justify-center bg-muted rounded-r-md cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        >
          <ClipboardCheckIcon size={18} />
        </div>
      </div>
      {link && !isValidLink && (
        <p className="text-xs text-slate-600 -mt-1.5">
          Please enter a valid link
        </p>
      )}
      {!link && (
        <p className="text-xs text-slate-600 -mt-1.5">
          Type in the link to a data you want to add to your Knowledge Hub.
        </p>
      )}
      <MetadataDisplay metadata={metadata} loading={metadataLoading} />
      <ParseBlock
        link={link}
        estimate={estimate}
        metadata={metadata}
        loading={estimateLoading}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
