import { cache } from "react"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import dayjs from "dayjs"

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

const estimate = 3600000 * 5 // 5 hours

export async function POST(
  request: Request,
) {
  const apiKey = request.headers.get("x-api-key")
  if (apiKey !== process.env.GPT_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
    })
  }

  const { url, user_id } = (await request.json()) as {
    url: string | undefined
    user_id: string | undefined
  }

  if (!user_id || !url) {
    return new Response(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
    })
  }

  const supabase = createServerSupabaseClient()

  const title = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0]

  const { data: link } = await supabase
    .from("links")
    .insert({
      url,
      estimate: { 
        time: estimate,
        deadline: dayjs().add(estimate, "ms").toISOString(),
        humanReadable: '5h'
      },
      title,
      user_id,
    })
    .select("*")
    .single()

  if (!link) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    })
  }

  return new Response(JSON.stringify({ data: { link } }), {
    status: 200,
  })
}
