"use server"

import { cache } from "react"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { Resend } from "resend"

import type { Database } from "@/lib/database.types"
import HelpRequestEmail from "@/components/emails/help-request"

const resend = new Resend(process.env.RESEND_API_KEY!)
const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerActionClient<Database>({ cookies: () => cookieStore })
})

export const sendHelpRequestEmail = async (data: FormData) => {
  const content = (data.get("content") as string) || ""
  if (!content)
    return {
      success: false,
      isError: true,
      error: "No content provided.",
      status: 400,
    }

  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return { success: false, isError: true, error: "Unauthorized", status: 401 }

  const emailResponse = await resend.emails.send({
    from: `sapientor. <support@askfutureself.co>`,
    to: process.env.SUPPORT_EMAIL || "valoiscene@gmail.com",
    subject: "Help Request",
    react: (
      <HelpRequestEmail
        content={content}
        userEmail={user.email || "No email provided."}
      />
    ),
  })

  if (emailResponse.data?.id) {
    return {
      success: true,
      isError: false,
      error: null,
      status: 200,
    }
  } else {
    return {
      success: false,
      isError: true,
      error: "Failed to send email.",
      status: 500,
    }
  }
}
