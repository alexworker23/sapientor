import { cache } from "react"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"
import { SummaryForm } from "@/components/summary/form"

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    }
  )
})

interface Props {
  params: {
    id: string
  }
}

const Page = async ({ params }: Props) => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error) throw error
  if (!data) return notFound()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <SummaryForm link={data} />
    </main>
  )
}

export default Page
