"use server"

import { cache } from "react"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

const admin_list =
  process.env.ADMIN_USERS?.split(",").map((user) => user.trim()) ?? []

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerActionClient<Database>(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_KEY,
    }
  )
})

export const rejectLink = async (data: FormData) => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return {
      code: 401,
      message: "Unauthorized",
    }
  }
  if (!admin_list.includes(user?.email)) {
    return {
      code: 403,
      message: "Forbidden",
    }
  }

  const id = data.get("id") as string
  const reason = data.get("reason") as string
  if (!id || !reason) {
    return {
      code: 400,
      message: "Bad Request",
    }
  }
  const { data: updatedEntity, error } = await supabase
    .from("links")
    .update({ status: "REJECTED", reason })
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    return {
      code: 500,
      message: "Internal Server Error. " + error.message,
    }
  }

  await supabase.from("notifications").insert({
    title: "Your link has been rejected.",
    description: `Your link "${updatedEntity.title?.slice(0, 50)}${
      updatedEntity.title && updatedEntity.title?.length > 50 ? "..." : ""
    }" has been rejected because ${reason}.`,
    user_id: updatedEntity.user_id,
  })

  return {
    code: 200,
    data: updatedEntity,
  }
}
