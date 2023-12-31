import { clsx, type ClassValue } from "clsx"
import { decode, encode } from "gpt-tokenizer"
import jwt from "jsonwebtoken"
import type { Document } from "langchain/document"
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
  const entities: { [key: string]: string } = {
    quot: '"',
    amp: "&",
    apos: "'",
    lt: "<",
    gt: ">",
    // Add other entities here if needed
  }

  return text
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&#[xX]([A-Fa-f0-9]+);/g, (match, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&(\w+);/g, (match, entity) => entities[entity] || match)
}

export const home_tab_cookie_name = "home-tab"

const SECRET_KEY = process.env.JWT_SECRET_KEY || ""

export function generateUserToken(userId: string): string {
  const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" })
  return token
}

export function decodeUserToken(token: string): {
  userId: string | null
  expired: boolean
} {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload
    return { userId: decoded.userId, expired: false }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { userId: null, expired: true }
    }
    console.error("Token verification failed:", error)
    return { userId: null, expired: false }
  }
}

export function splitDocuments(docs: Document[], maxTokens = 1536, overlaySize = 200): Document[] {
  let splitDocs: Document[] = [];

  for (const doc of docs) {
    const tokens = encode(doc.pageContent);
    if (tokens.length > maxTokens) {
      let currentTokens: number[] = [];
      let startIndex = 0;

      while (startIndex < tokens.length) {
        let endIndex = Math.min(startIndex + maxTokens, tokens.length);
        if (endIndex < tokens.length) endIndex -= overlaySize;

        currentTokens = tokens.slice(startIndex, endIndex);
        const splitContent = decode(currentTokens);
        splitDocs.push({ ...doc, pageContent: splitContent });

        startIndex = endIndex;
        if (endIndex < tokens.length) startIndex += overlaySize;
      }
    } else {
      splitDocs.push(doc);
    }
  }

  return splitDocs;
}
