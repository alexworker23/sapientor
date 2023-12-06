import type { Message } from "ai/react"
import { create } from "zustand"

import type { LinkMetadata } from "./types"

interface LinkStoreState {
  link: string
  setLink: (newLink: string) => void

  linkMetadata: LinkMetadata | null
  setLinkMetadata: (newLinkMetadata: LinkMetadata | null) => void
  linkMetadataLoading: boolean
  setLinkMetadataLoading: (isLoading: boolean) => void

  estimate: string | null
  setEstimate: (newEstimate: string | null) => void
  estimateLoading: boolean
  setEstimateLoading: (isLoading: boolean) => void

  saveSuccess: boolean
  setSaveSuccess: (isSuccess: boolean) => void
}

export const useLinkStore = create<LinkStoreState>((set) => ({
  link: "",
  setLink: (newLink: string) => set({ link: newLink }),

  linkMetadata: null,
  setLinkMetadata: (newLinkMetadata: LinkMetadata | null) =>
    set({ linkMetadata: newLinkMetadata }),
  linkMetadataLoading: false,
  setLinkMetadataLoading: (isLoading: boolean) =>
    set({ linkMetadataLoading: isLoading }),

  estimate: null,
  setEstimate: (newEstimate: string | null) => set({ estimate: newEstimate }),
  estimateLoading: false,
  setEstimateLoading: (isLoading: boolean) =>
    set({ estimateLoading: isLoading }),

  saveSuccess: false,
  setSaveSuccess: (isSuccess: boolean) => set({ saveSuccess: isSuccess }),
}))

interface MessagesStoreState {
  messages: Message[]
  setMessages: (newMessages: Message[]) => void
}

export const useMessagesStore = create<MessagesStoreState>((set) => ({
  messages: [],
  setMessages: (newMessages: Message[]) => set({ messages: newMessages }),
}))
