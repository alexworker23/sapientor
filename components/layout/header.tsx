import Link from "next/link"

import { HeaderNav } from "./header-nav"

export const Header = () => {
  return (
    <header className="absolute left-0 top-0 z-50 w-full">
      <div className="flex h-16 w-full items-center justify-between gap-x-5 bg-white/95 px-5 backdrop-blur sm:container supports-[backdrop-filter]:bg-white/60 sm:gap-x-0">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="text-lg font-bold">
            sapientor.
          </Link>
        </div>
        <HeaderNav />
      </div>
    </header>
  )
}
