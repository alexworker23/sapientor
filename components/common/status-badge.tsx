import type { StatusEnumType } from "@/lib/types"
import { cn } from "@/lib/utils"

export const StatusBadge = ({ status }: { status: StatusEnumType }) => {
  const text = status.charAt(0) + status.slice(1).toLowerCase()
  return (
    <div
      className={cn(
        "h-7 w-23 rounded-full bg-slate-50 text-xs flex justify-center items-center",
        getColor(status)
      )}
    >
      {text}
    </div>
  )
}

const getColor = (status: StatusEnumType) => {
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
