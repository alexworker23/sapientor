import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const body = (await request.json()) as { redirectTo: string | undefined }

  const requestUrl = new URL(request.url)
  const supabase = createRouteHandlerClient<Database>({ cookies })

  if (body.redirectTo) {
    cookies().set("redirectTo", body.redirectTo)
  }

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${requestUrl.origin}/auth/callback`,
    },
  })

  return NextResponse.json({ data }, { status: 200 })
}
