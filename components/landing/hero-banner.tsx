import Link from "next/link"

import { Button } from "../ui/button"
import { AppPreviewCard } from "./app-preview-card"

export const HeroBanner = () => {

  return (
    <div className="w-full">
      <div className="container px-4 md:px-6">
        <p className="text-yellow-500 text-semibold text-center relative">
          Project has been shut down and is used for presentation purposes only.
        </p>
        <AppPreviewCard />
        <div className="mx-auto max-w-2xl flex flex-col items-center">
          <p className="max-w-xl text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mb-5 text-center">
            {desc_v5}
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/tutorial">
              <Button variant="outline">Open Tutorial</Button>
            </Link>
            <Link prefetch href="/add">
              <Button className="text-sm">Get Started</Button>
            </Link>
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
  "Effortlessly organise your data into a Knowledge Hub ready to enhance any AI chatbot. Upload with a simple click: links, files, or notes. Navigate your knowledge with ease, engage through interactive chats, or secure it for future use."
