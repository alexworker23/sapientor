"use client"

import { useEffect, type ChangeEventHandler } from "react"
import dayjs from "dayjs"
import { CheckCircle, ClipboardCheckIcon } from "lucide-react"

import { useDebounce } from "@/lib/client-utils"
import { useLinkStore } from "@/lib/store"
import { LinkEstimate } from "@/lib/types"
import { msToHumanReadable, urlRegex } from "@/lib/utils"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { MetadataDisplay } from "./metadata-display"
import { ParseBlock } from "./parse-block"

export const LinkForm = () => {
  const {
    link,
    setLink,
    linkMetadata,
    setLinkMetadata,
    estimate,
    setEstimate,
    linkMetadataLoading,
    setLinkMetadataLoading,
    estimateLoading,
    setEstimateLoading,
    saveSuccess,
    setSaveSuccess,
  } = useLinkStore()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setLink(event.target.value)
    linkMetadata && setLinkMetadata(null)
    estimate && setEstimate(null)
  }

  const getMetadata = async (url: string) => {
    try {
      setLinkMetadataLoading(true)
      const response = await fetch(`/api/metadata`, {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
      setLinkMetadata(response)
      return response
    } catch (error) {
      console.error(error)
    } finally {
      setLinkMetadataLoading(false)
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
        | Omit<LinkEstimate, "humanReadable">
        | undefined
      if (!response) return

      const humanReadable = msToHumanReadable(response.time)
      setEstimate({ ...response, humanReadable })
    } catch (error) {
      console.error(error)
    } finally {
      setEstimateLoading(false)
    }
  }

  const fetchLinkData = async (url: string) => {
    const isValid = urlRegex.test(url)
    if (!isValid) return

    const isSame = url === linkMetadata?.url
    if (isSame) return

    try {
      const metadataResponse = await getMetadata(url)
      getEstimate(url, metadataResponse.title)
    } catch (error) {
      console.error(error)
    }
  }

  const debouncedLink = useDebounce(link, 1000)
  useEffect(() => {
    fetchLinkData(debouncedLink)
  }, [debouncedLink])

  const handlePaste = async () => {
    await navigator.clipboard.readText().then((text) => {
      if (!text.trim()) return
      setLink(text)
      linkMetadata && setLinkMetadata(null)
      estimate && setEstimate(null)
      fetchLinkData(text)
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
