import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createRouteHandlerClient<Database>({ cookies })

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${requestUrl.origin}/auth/callback` },
  })

  return NextResponse.json({ data }, { status: 200 })
}
