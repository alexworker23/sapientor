"use client"

import { useEffect, useRef, type FormEventHandler } from "react"

import { useInputStore } from "@/lib/store"

interface Props {
  handleSubmit: () => void
}

export const TextareaInput = ({ handleSubmit }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { value, setValue, metadata, setMetadata } = useInputStore()

  useEffect(() => {
    if (value && textareaRef.current) {
      const event = new Event("input", { bubbles: true })
      textareaRef.current.dispatchEvent(event)
    }
  }, [value])

  const handleTextAreaResize: FormEventHandler<HTMLTextAreaElement> = (e) => {
    const target = e.target as HTMLTextAreaElement
    const parentDiv = target.closest(".flex") as HTMLDivElement

    if (target.value) {
      // Only resize if there is text
      target.style.height = "auto"
      const newHeight = target.scrollHeight + "px"
      target.style.height = newHeight
      if (parentDiv) {
        parentDiv.style.height = newHeight
      }
    } else {
      // Reset the heights if the textarea is empty
      target.style.height = "auto"
      if (parentDiv) {
        parentDiv.style.height = "initial" // or set to a specific value if you have one
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    metadata && setMetadata(null)
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <textarea
      id="textarea-input"
      ref={textareaRef}
      placeholder="Insert a link, type text or upload a file"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeydown}
      className="w-full disabled:opacity-80 text-primary text-sm bg-slate-50 border-0 shadow-none resize-none outline-none ring-0 disabled:bg-transparent selection:bg-blue-200 selection:text-black placeholder:text-slate-500 placeholder:truncate pr-2 [scroll-padding-block:0.75rem] leading-relaxed py-3 pl-2.5 [&_textarea]:px-0"
      style={{ colorScheme: "dark" }}
      rows={1}
      onInput={handleTextAreaResize}
    />
  )
}
