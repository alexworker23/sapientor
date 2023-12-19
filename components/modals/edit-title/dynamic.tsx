"use client"

import dynamic from "next/dynamic"

import type { EditTitleModalProps } from "."

const Component = dynamic(() => import(".").then((c) => c.EditTitleModal))

export const EditTitleModal = (props: EditTitleModalProps) => (
  <Component {...props} />
)
