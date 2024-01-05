import { Resend } from "resend"

import ComplexLinkEmail from "@/components/emails/complex-link"

import type { SourceEntity } from "./types"

const resend = new Resend(process.env.RESEND_API_KEY!)

export const handleComplexLinkEmailSend = async (
  source: Partial<SourceEntity>
) => {
  return await resend.emails.send({
    from: `sapientor. <feedback@sapientor.net>`,
    to: process.env.SUPPORT_EMAIL || "valoiscene@gmail.com",
    subject: `Complex link request - ${source?.title}`,
    react: (
      <ComplexLinkEmail
        url={source?.url || "No URL provided."}
        title={source?.title || "No title provided."}
        userId={source?.user_id || "No user provided."}
      />
    ),
  })
}
