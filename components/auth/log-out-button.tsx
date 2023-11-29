"use client"

import { LogOut } from "lucide-react"

import { DropdownMenuItem } from "../ui/dropdown-menu"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/database.types"

export const LogOutButton = () => {
  const supabase = createClientComponentClient<Database>()
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut().then(() => {
        window.location.replace("/")
      })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <DropdownMenuItem
      className="flex justify-between"
      onClick={handleSignOut}
    >
      <span>Logout</span>
      <LogOut size={16} className="ml-2" />
    </DropdownMenuItem>
  )
}
