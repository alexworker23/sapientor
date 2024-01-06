import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "../ui/button"
import { GetStartedButton } from "./get-started-button"

export const HeroBanner = () => {
  return (
    <div className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:gap-12 lg:grid-cols-2">
          <Image
            alt="application screenshot"
            src="/screenshot.png"
            height={360}
            width={640}
            className="border rounded-lg shadow-lg"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Introducing <span className="underline">Sapientor</span>
              </h2>
              <p className="max-w-xl text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {desc_v5}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/tutorial">
                <Button variant="outline">See Tutorial</Button>
              </Link>
              <Suspense
                fallback={
                  <div className="h-9 rounded-md w-20 bg-primary animate-pulse" />
                }
              >
                <GetStartedButton />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// const desc_v1 = 'Build your Knowledge Hub - a central place for all your data. Simply add links, files, or text notes. Easily organize and access your information, interact with it through chat interfaces, or download it for anytime use.'
// const desc_v2 = 'Effortlessly create your Knowledge Hub to streamline data management. Upload links, files, or notes in a snap. Enjoy organized, easy-to-access knowledge, with options for interactive chat usage or convenient downloads.'
// const desc_v3 = 'Start building your Knowledge Hub today! Add any link, file, or note with ease. Keep your knowledge well-organized and accessible, ready for interactive chats or to download whenever needed.'
// const desc_v4 = 'Welcome to your new Knowledge Hub, where organizing data is a breeze. Add links, files, or notes in just a click. Dive into your neatly arranged information, chat interactively, or download your data for future reference.'
const desc_v5 =
  "Effortlessly organise your data into a Knowledge Hub ready to enhance any AI chatbot. Upload with a simple click: links, files, or notes. Navigate your knowledge with ease, engage through interactive chats, or secure it for future use. Transform how you manage information today."
