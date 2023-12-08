"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "../ui/button"
import { useToast } from "../ui/use-toast"

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copy = () => {
    try {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000)
      toast({
        title: "Copied to clipboard",
        description: "You can now paste it in ChatGPT",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error copying to clipboard",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }
  return (
    <Button
      type="button"
      onClick={copy}
      disabled={copied}
      size="sm"
      className="gap-1 w-24 text-sm"
    >
      {copied ? "Copied" : "Copy"}
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </Button>
  )
}
