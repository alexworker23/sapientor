"use client"

import { useState } from "react"

import { Textarea } from "@/components/ui/textarea"

import { SuccessMessage } from "../success-message"
import { ParseBlock } from "./parse-block"

export const TextForm = () => {
  const [text, setText] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)

  if (saveSuccess) {
    return (
      <SuccessMessage type="file" handleClose={() => setSaveSuccess(false)} />
    )
  }

  const handleSuccess = () => {
    setSaveSuccess(true)
    setText("")
  }

  return (
    <div className="grid gap-3">
      <Textarea
        className="w-full"
        placeholder="Input your text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <ParseBlock text={text} onSuccess={handleSuccess} />
    </div>
  )
}
