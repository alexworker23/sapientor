"use client"

import dynamic from "next/dynamic"

import type { EditSourceModalProps } from "."

const Component = dynamic(() => import(".").then((c) => c.EditSourceModal))

export const EditSourceModal = (props: EditSourceModalProps) => (
  <Component {...props} />
)
