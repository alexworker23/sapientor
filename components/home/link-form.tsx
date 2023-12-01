"use client"

import { useState } from "react"
import { ClipboardCheckIcon } from "lucide-react"

import { Button } from "../ui/button"
import { Input } from "../ui/input"

export const LinkForm = () => {
  const [link, setLink] = useState("")

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      setLink(text)
    })
  }

  const regex = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  )
  const isValid = regex.test(link)

  return (
    <div className="grid gap-3">
      <div className="relative">
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Paste a link"
          className="w-full"
        />
        <div
          onClick={handlePaste}
          className="absolute right-0 top-1/2 flex h-full w-10 -translate-y-1/2 items-center justify-center bg-muted rounded-r-md transition-opacity hover:opacity-70 cursor-pointer"
        >
          <ClipboardCheckIcon size={18} className="text-muted-foreground" />
        </div>
      </div>
      {/* Here should be a preview of a link with OpenGraph */}
      {/* Here should be an estimation of how long it will take */}
      <Button disabled={!isValid} className="w-[140px] mx-auto">
        Save link
      </Button>
    </div>
  )
}
