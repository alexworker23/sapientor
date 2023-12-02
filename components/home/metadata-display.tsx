import type { LinkMetadata } from "@/lib/types"

import { Avatar, AvatarImage } from "../ui/avatar"
import { Card, CardDescription, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

interface Props {
  metadata: LinkMetadata | null
  loading: boolean
}

export const MetadataDisplay = ({ metadata, loading }: Props) => {
  if (loading) return <MetadataDisplaySkeleton />

  if (!metadata) return null

  return (
    <Card className="flex p-4 items-start space-x-4 max-w-full overflow-hidden">
      <div className="flex items-center space-x-2 flex-shrink-0 mt-1">
        <Avatar className="w-6 h-6">
          <AvatarImage src={metadata.favicon} />
        </Avatar>
      </div>
      <div className="space-y-1 flex-grow min-w-0">
        <CardTitle className="truncate text-xl">
          {decodeHtmlEntities(metadata.title)}
        </CardTitle>
        <CardDescription className="truncate text-sm">
          {decodeHtmlEntities(metadata.description)}
        </CardDescription>
      </div>
    </Card>
  )
}

const MetadataDisplaySkeleton = () => {
  return (
    <Card className="flex p-4 items-start space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </Card>
  )
}

function decodeHtmlEntities(text: string): string {
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
