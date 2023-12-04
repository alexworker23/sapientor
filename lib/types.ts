import { Database } from "./database.types"

export type LinkMetadata = {
  title: string
  description: string
  favicon: string
  url: string
}

export type LinkEntity = Database["public"]["Tables"]["links"]["Row"]

export type Status = Database["public"]["Enums"]["status"]
