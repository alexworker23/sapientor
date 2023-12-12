"use client"

import dynamic from "next/dynamic"

import type { DeleteModalProps } from "."

const Component = dynamic(() => import(".").then((c) => c.DeleteModal))

export const DeleteModal = (props: DeleteModalProps) => <Component {...props} />
