"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const HeaderTitle = () => {
  const pathname = usePathname()
  const isHome = pathname === "/"
  return (
    <Link href="/" className={cn("text-lg font-bold",
        isHome ? "" : "hover:scale-110 transition-all duration-250 ease-linear"
    )}>
      {isHome ? "sapientor." : "s."}
    </Link>
  )
}
