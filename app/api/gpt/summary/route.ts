import { cache } from "react"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    }
  )
})

export async function POST(request: Request) {
  const { summary, email } = (await request.json()) as {
    summary: string
    email: string
  }

  if (!summary || !email) {
    return new Response(JSON.stringify({ error: "Missing summary or email" }), {
      status: 400,
    })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("test-gpt")
    .insert({
      summary,
      email,
    })
    .select("*")
    .single()

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ data }), {
    status: 200,
  })
}
