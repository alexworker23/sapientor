import type { Status } from "@/lib/types"
import { cn } from "@/lib/utils"

export const StatusBadge = ({ status }: { status: Status }) => {
  const text = status.charAt(0) + status.slice(1).toLowerCase()
  return (
    <div
      className={cn(
        "py-1.5 px-6 rounded-full bg-slate-50 text-xs",
        getColor(status)
      )}
    >
      {text}
    </div>
  )
}

const getColor = (status: Status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-50 text-green-600"
    case "REJECTED":
      return "bg-red-50 text-red-600"
    case "PENDING":
      return "bg-yellow-50 text-yellow-600"
    default:
      return "bg-slate-50 text-slate-600"
  }
}
