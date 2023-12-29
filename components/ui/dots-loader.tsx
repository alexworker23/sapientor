import { cn } from "@/lib/utils"

const common_class = "w-2 h-2 rounded-full bg-primary animate-blinking"

export const DotsLoader = ({ className }: { className?: string }) => {
  return (
    <div className="flex items-center gap-0.5">
      <div className={cn(common_class, className)} />
      <div className={cn(common_class, "delay-250", className)} />
      <div className={cn(common_class, "delay-500", className)} />
    </div>
  )
}
