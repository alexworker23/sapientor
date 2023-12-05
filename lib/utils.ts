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

// function that will convert ms into a human readable format e.g. 1000ms => 1s, 1000000ms => 16m 40s, 1000000000ms => 16h 40m 40s. Display only if the unit is greater than 0.
export function msToHumanReadable(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))

  const daysStr = days ? `${days}d` : ""
  const hoursStr = hours ? `${hours}h` : ""
  const minutesStr = minutes ? `${minutes}m` : ""
  const secondsStr = seconds ? `${seconds}s` : ""

  return `${daysStr} ${hoursStr} ${minutesStr} ${secondsStr}`.trim()
}

export function decodeHtmlEntities(text: string): string {
  if (!document) return text
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
