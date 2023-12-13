"use client"

import { useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import type { Database } from "@/lib/database.types"

import { useToast } from "../ui/use-toast"
import { useRouter } from "next/navigation"

export const NotificationsListener = () => {
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const channel = supabase
      .channel("realtime notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        async (payload) => {
          toast({
            title: payload.new.title,
            description: payload.new.description || undefined,
            variant: payload.new.variant || undefined,
          })
          await supabase.from('notifications').update({ seen: true }).eq('id', payload.new.id)
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return <></>
}
