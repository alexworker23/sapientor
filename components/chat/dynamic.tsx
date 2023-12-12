"use client"

import dynamic from "next/dynamic"

const Component = dynamic(() => import("./chat").then((c) => c.Chat))

export const Chat = () => <Component />
