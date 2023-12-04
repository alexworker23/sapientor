"use client"

import { useChat } from "ai/react"

import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  return (
    <div>
      <div className="mb-5 grid gap-1">
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea value={input} onChange={handleInputChange} />
        <Button type="submit" className="mx-auto w-24">
          Send
        </Button>
      </form>
    </div>
  )
}
