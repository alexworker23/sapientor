"use client"

import dynamic from "next/dynamic"

export const SourceInput = dynamic(
  () => import("./input").then((mod) => mod.SourceInput),
  {
    loading: () => (
      <div className="w-full max-w-[90%] sm:max-w-lg mx-auto sm:mt-24 py-3 pl-2.5 shadow-md animate-pulse h-12 bg-slate-50 rounded-2xl text-sm leading-relaxed">
        Loading...
      </div>
    ),
  }
)
