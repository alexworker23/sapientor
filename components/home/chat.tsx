"use client"

import { useChat } from "ai/react"

import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { AiMessage, UserMessage } from "./messages"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const button = e.currentTarget.form?.querySelector("button")
      button?.click()
    }
  }
  return (
    <div>
      <div className="mb-2.5 grid gap-1">
        {messages.map((m) =>
          m.role === "user" ? (
            <UserMessage key={m.id} content={m.content} />
          ) : (
            <AiMessage key={m.id} content={m.content} />
          )
        )}
        {messages.length === 0 && (
          <UserMessage content="Write your questions in the input below..." />
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          onKeyDown={handleKeyDown}
          value={input}
          onChange={handleInputChange}
        />
        <Button type="submit" className="mx-auto w-24">
          Send
        </Button>
      </form>
    </div>
  )
}
