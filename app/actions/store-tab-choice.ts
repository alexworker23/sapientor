"use server"

import { cookies } from "next/headers"

export const storeTabChoice = (data: FormData) => {
  const name = data.get("name") as string
  const value = data.get("value") as string

  const cookieStore = cookies()
  cookieStore.set(name, value)

  return { success: true }
}
