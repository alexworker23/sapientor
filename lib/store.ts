import type { Message } from "ai/react"
import { create } from "zustand"

import type { LinkMetadata } from "./types"

interface MessagesStoreState {
  messages: Message[]
  setMessages: (newMessages: Message[]) => void
}

export const useMessagesStore = create<MessagesStoreState>((set) => ({
  messages: [],
  setMessages: (newMessages: Message[]) => set({ messages: newMessages }),
}))

interface InputStoreState {
  value: string
  setValue: (newValue: string) => void

  files: File[] | null
  setFiles: (newFiles: File[] | null) => void

  metadata: LinkMetadata | null
  setMetadata: (newLinkMetadata: LinkMetadata | null) => void

  submitting: boolean
  setSubmitting: (isSubmitting: boolean) => void

  success: boolean
  setSuccess: (isSuccess: boolean) => void
  successMessage: string | null
  setSuccessMessage: (newSuccessMessage: string | null) => void
}

export const useInputStore = create<InputStoreState>((set) => ({
  value: "",
  setValue: (newValue: string) => set({ value: newValue }),

  files: null,
  setFiles: (newFiles: File[] | null) => set({ files: newFiles }),

  metadata: null,
  setMetadata: (newLinkMetadata: LinkMetadata | null) =>
    set({ metadata: newLinkMetadata }),

  submitting: false,
  setSubmitting: (isSubmitting: boolean) => set({ submitting: isSubmitting }),

  success: false,
  setSuccess: (isSuccess: boolean) => set({ success: isSuccess }),
  successMessage: null,
  setSuccessMessage: (newSuccessMessage: string | null) =>
    set({ successMessage: newSuccessMessage }),
}))
