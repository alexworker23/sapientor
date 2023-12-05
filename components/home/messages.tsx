"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

const Markdown = dynamic(() => import("react-markdown"))

const common_class = "rounded-md p-2.5 w-full"

export const UserMessage = ({
  content,
  className,
}: {
  content: string
  className?: string
}) => {
  return (
    <div className={cn(common_class, "bg-gray-100", className)}>
      <Markdown>{content}</Markdown>
    </div>
  )
}

export const AiMessage = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className={cn(common_class, "group relative bg-blue-200")}>
      <Markdown>{content}</Markdown>
      <div
        onClick={handleCopy}
        className={cn(
          "absolute bottom-2.5 right-2.5 transition-all",
          copied
            ? "text-blue-600 opacity-100"
            : "cursor-pointer opacity-0 hover:scale-110 group-hover:opacity-100"
        )}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </div>
    </div>
  )
}
