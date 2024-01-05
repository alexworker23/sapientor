import React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

interface FeedbackEmailProps {
  url: string
  title: string
  userId: string
}

export default function ComplexLinkEmail({
  url = "https://example.com",
  title = "Example title",
  userId = "abc-123",
}: FeedbackEmailProps) {
  const previewText = `Complex link needs to be parsed for ${userId}`
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto my-10 w-[465px] p-5">
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              Complex link request
            </Heading>
            <Text className="text-sm">{`User ID: ${userId}`}</Text>
            <Section className="my-[16px]">
              <Text className="text-sm">{`Link URL: ${url}`}</Text>
              <Text className="text-sm">{`Link Title: ${title}`}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
