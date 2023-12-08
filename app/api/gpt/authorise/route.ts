import { cache } from "react"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { decodeUserToken } from "@/lib/utils"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    }
  )
})

export async function GET(request: NextRequest) {
  const header = request.headers.get("x-api-key")
  if (header !== process.env.GPT_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
    })
  }

  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get("token")

  if (!token) {
    return new Response(JSON.stringify({ error: "Token is required" }), {
      status: 400,
    })
  }

  const { userId, expired } = decodeUserToken(token)
  if (expired) {
    return new Response(JSON.stringify({ error: "Token has expired" }), {
      status: 400,
    })
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 400,
    })
  }

  const supabase = createServerSupabaseClient()
  const { data: user, error } = await supabase.auth.admin.getUserById(userId)

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
    })
  }

  return new Response(
    JSON.stringify({
      id: user.user.id,
      email: user.user.email,
    }),
    {
      status: 200,
    }
  )
}
