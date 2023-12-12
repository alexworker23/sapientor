"use client"

import dynamic from "next/dynamic"

import type { AuthModalProps } from "./modal"

const Component = dynamic(
  () => import("./modal").then((mod) => mod.AuthModal),
  {
    loading: () => (
      <div className="h-9 rounded-md w-20 bg-primary animate-pulse" />
    ),
  }
)

export const AuthModal = (props: AuthModalProps) => <Component {...props} />
