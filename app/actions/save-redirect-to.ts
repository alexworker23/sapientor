"use server"

import { cookies } from "next/headers"

export const saveRedirectTo = async (data: FormData) => {
  const path = data.get("path") as string
  if (!path) return
  cookies().set("redirectTo", path)
  return
}
