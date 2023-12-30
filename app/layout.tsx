import type { Metadata, Viewport } from "next"
import { Inter as FontSans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css"

import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/layout/header"
import { NotificationsListener } from "@/components/notifications/listener"

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          fontSans.className
        )}
      >
        <Header />
        {children}
        <Toaster />
        <NotificationsListener />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "sapientor",
  description:
    "Effortlessly organise your data into a Knowledge Hub ready to enhance any AI chatbot. Upload with a simple click: links, files, or notes. Navigate your knowledge with ease, engage through interactive chats, or secure it for future use. Transform how you manage information today.",
  keywords:
    "ai knowledge base, personal knowledge base, open ai knowledge base, ai knowledge management, sapientor, knowledge base, knowledge hub",
  metadataBase: new URL("https://sapientor.net"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "sapientor",
    description:
      "Effortlessly organise your data into a Knowledge Hub ready to enhance any AI chatbot. Upload with a simple click: links, files, or notes. Navigate your knowledge with ease, engage through interactive chats, or secure it for future use. Transform how you manage information today.",
    url: `https://sapientor.net`,
  },
  twitter: {
    card: "summary_large_image",
    title: "sapientor",
    description:
      "Effortlessly organise your data into a Knowledge Hub ready to enhance any AI chatbot. Upload with a simple click: links, files, or notes. Navigate your knowledge with ease, engage through interactive chats, or secure it for future use. Transform how you manage information today.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
}
