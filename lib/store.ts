import type { Message } from "ai/react"
import { create } from "zustand"

import type { LinkMetadata, ParsingEstimate } from "./types"

interface LinkStoreState {
  link: string
  setLink: (newLink: string) => void

  metadata: LinkMetadata | null
  setMetadata: (newLinkMetadata: LinkMetadata | null) => void
  metadataLoading: boolean
  setMetadataLoading: (isLoading: boolean) => void

  estimate: ParsingEstimate | null
  setEstimate: (newEstimate: ParsingEstimate | null) => void
  estimateLoading: boolean
  setEstimateLoading: (isLoading: boolean) => void

  saveSuccess: boolean
  setSaveSuccess: (isSuccess: boolean) => void
}

export const useLinkStore = create<LinkStoreState>((set) => ({
  link: "",
  setLink: (newLink: string) => set({ link: newLink }),

  metadata: null,
  setMetadata: (newLinkMetadata: LinkMetadata | null) =>
    set({ metadata: newLinkMetadata }),
  metadataLoading: false,
  setMetadataLoading: (isLoading: boolean) =>
    set({ metadataLoading: isLoading }),

  estimate: null,
  setEstimate: (newEstimate: ParsingEstimate | null) =>
    set({ estimate: newEstimate }),
  estimateLoading: false,
  setEstimateLoading: (isLoading: boolean) =>
    set({ estimateLoading: isLoading }),

  saveSuccess: false,
  setSaveSuccess: (isSuccess: boolean) => set({ saveSuccess: isSuccess }),
}))

interface FileStoreState {
  files: File[] | null
  setFiles: (newFiles: File[] | null) => void

  estimate: ParsingEstimate | null
  setEstimate: (newEstimate: ParsingEstimate | null) => void

  saveSuccess: boolean
  setSaveSuccess: (isSuccess: boolean) => void
}

export const useFileStore = create<FileStoreState>((set) => ({
  files: null,
  setFiles: (newFiles: File[] | null) => set({ files: newFiles }),

  estimate: null,
  setEstimate: (newEstimate: ParsingEstimate | null) =>
    set({ estimate: newEstimate }),

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

interface InputStoreState {
  value: string
  setValue: (newValue: string) => void

  files: File[] | null
  setFiles: (newFiles: File[] | null) => void

  estimate: ParsingEstimate | null
  setEstimate: (newEstimate: ParsingEstimate | null) => void

  success: boolean
  setSuccess: (isSuccess: boolean) => void
}

export const useInputStore = create<InputStoreState>((set) => ({
  value: "",
  setValue: (newValue: string) => set({ value: newValue }),

  files: null,
  setFiles: (newFiles: File[] | null) => set({ files: newFiles }),

  estimate: null,
  setEstimate: (newEstimate: ParsingEstimate | null) =>
    set({ estimate: newEstimate }),

  success: false,
  setSuccess: (isSuccess: boolean) => set({ success: isSuccess }),
}))
