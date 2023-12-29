"use client"

import { useEffect } from "react"
import { useChat } from "ai/react"

import { useMessagesStore } from "@/lib/store"

import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { AiMessage, AiMessageLoader, UserMessage } from "./messages"
import { StopCircle } from "lucide-react"

export function Chat() {
  const { messages: initialMessages, setMessages } = useMessagesStore()
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      initialMessages,
    })

  const isAiLoading = messages.length !== 0 && messages.at(-1)?.role === "user"

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
      <div className="mb-2.5 flex flex-col gap-1 w-full">
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
            content="This chat is connected to your Knowledge Hub, so you can ask questions based on the already processed sources.."
            className="min-h-[44px] w-full"
          />
        )}
        {isAiLoading && <AiMessageLoader className="self-end" />}
      </div>
      <div className="fixed bottom-0 left-1/2 z-50 w-full px-2.5 sm:px-0 max-w-2xl -translate-x-1/2 bg-white/95 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-white/60 sm:py-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            onKeyDown={handleKeyDown}
            value={input}
            onChange={handleInputChange}
            className="resize-none"
            placeholder="Your question..."
          />
          <div className="flex relative justify-center">
            <Button type="submit" className="w-24">
              Send
            </Button>
            {isLoading && 
            <div className="absolute top-1/2 -translate-y-1/2 right-0">
              <StopCircle onClick={stop} className="hover:opacity-50 transition-opacity cursor-pointer" />
            </div>}
          </div>
        </form>
      </div>
    </div>
  )
}
