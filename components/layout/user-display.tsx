// import { FeedbackModal } from "./feedback-modal"
// import { HelpModal } from "./help-modal"
import Link from "next/link"
import type { User } from "@supabase/auth-helpers-nextjs"
import { LinkIcon } from "lucide-react"

import { LogOutButton } from "../auth/log-out-button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { FeedbackModal } from "./feedback-modal"
import { HelpModal } from "./help-modal"

interface Props {
  user: User
}

export const UserDisplay = ({ user }: Props) => {
  const fallback = user.email
    ? user.email
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase()
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer transition-opacity hover:opacity-60">
          <AvatarImage src={user.user_metadata.image ?? ""} />
          <AvatarFallback>{fallback || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href="/links">
          <DropdownMenuItem className="flex justify-between">
            <span>Inventory</span>
            <LinkIcon size={16} className="ml-2" />
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator /> 
        <HelpModal />
        <FeedbackModal />
        <DropdownMenuSeparator /> 
        <LogOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
