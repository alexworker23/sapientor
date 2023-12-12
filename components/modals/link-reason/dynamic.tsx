"use client"

import dynamic from "next/dynamic"

import type { ReasonModalProps } from "."

const Component = dynamic(() => import(".").then((c) => c.ReasonModal))

export const ReasonModal = (props: ReasonModalProps) => <Component {...props} />
