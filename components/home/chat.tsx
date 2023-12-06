"use client"

import { useEffect } from "react"
import { useChat } from "ai/react"

import { useMessagesStore } from "@/lib/store"

import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { AiMessage, UserMessage } from "./messages"

export function Chat() {
  const { messages: initialMessages, setMessages } = useMessagesStore()
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages,
    })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const button = e.currentTarget.form?.querySelector("button")
      button?.click()
    }
  }

  useEffect(() => {
    if (isLoading) return
    return () => {
      setMessages(messages)
    }
  }, [messages, isLoading])

  return (
    <div className="mb-44">
      <div className="mb-2.5 flex flex-col gap-1">
        {messages.map((m) =>
          m.role === "user" ? (
            <UserMessage key={m.id} content={m.content} className="w-4/5" />
          ) : (
            <AiMessage
              key={m.id}
              content={m.content}
              className="w-4/5 self-end"
            />
          )
        )}
        {messages.length === 0 && (
          <UserMessage
            content="Our assistant has your Knowledge Hub connected, so you can ask him questions based on the already processed links.."
            className="min-h-[44px]"
          />
        )}
      </div>
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 bg-white/95 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-white/60 sm:py-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            onKeyDown={handleKeyDown}
            value={input}
            onChange={handleInputChange}
            className="resize-none"
            placeholder="Your question..."
          />
          <Button type="submit" className="mx-auto w-24">
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
