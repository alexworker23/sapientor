import { Database } from "./database.types"

export type LinkMetadata = {
  title: string
  description: string
  favicon: string
  url: string
}

export type LinkEntity = Database["public"]["Tables"]["links"]["Row"]

export type StatusEnumType = Database["public"]["Enums"]["status"]
