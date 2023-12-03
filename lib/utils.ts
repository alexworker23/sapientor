import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const urlRegex = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i"
)

export function decodeHtmlEntities(text: string): string {
  // Create an element to use as a decoder.
  const textArea = document.createElement("textarea")

  // Function to replace each entity with the actual character.
  const decodeEntity = (match: string): string => {
    textArea.innerHTML = match
    return textArea.value
  }

  // Regular expression to match HTML entities.
  const entityPattern = /&#(\d+);|&#[xX]([A-Fa-f0-9]+);|&(\w+);/g

  // Replace all entities in the text.
  return text.replace(entityPattern, decodeEntity)
}
