// import { FeedbackModal } from "./feedback-modal"
// import { HelpModal } from "./help-modal"
import { LogOutButton } from "../auth/log-out-button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

interface Props {
  user: any
}

export const UserDisplay = ({ user }: Props) => {
  const fallback = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
    : user.name?.slice(0, 2).toUpperCase()
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer transition-opacity hover:opacity-60">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback>{fallback || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <HelpModal /> */}
        {/* <FeedbackModal /> */}
        <LogOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
