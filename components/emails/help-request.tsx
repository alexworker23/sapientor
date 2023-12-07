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

interface HelpRequestEmailProps {
  content: string
  userEmail: string
}

export default function HelpRequestEmail({
  content = "Default help request content.",
  userEmail = "johndoe@example.com",
}: HelpRequestEmailProps) {
  const previewText = `Help Request from ${userEmail}`
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="mx-auto my-10 w-[465px] p-5">
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              Help Request
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
