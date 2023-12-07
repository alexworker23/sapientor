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
  content: string
  userEmail: string
}

export default function FeedbackEmail({
  content = "Default feedback content.",
  userEmail = "jamesbrown@example.com",
}: FeedbackEmailProps) {
  const previewText = `Feedback from ${userEmail}`
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto my-10 w-[465px] p-5">
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              Feedback
            </Heading>
            <Text className="text-sm">{`Email: ${userEmail}`}</Text>
            <Section className="my-[16px]">
              <Text className="text-sm">{`Content: ${content}`}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
