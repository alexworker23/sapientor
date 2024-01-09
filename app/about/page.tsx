import type { Metadata } from "next/types"

import { Footer } from "@/components/layout/footer"

export default function Page() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-20 min-h-screen">
        <section className="mb-20">
          <h1 className="mb-5 text-2xl font-medium sm:text-3xl">About</h1>
          <p className="mb-2.5">
            This app is driven by the speed of AI development and adoption.{" "}
            <br />
            At the time of development, in December 2023, the latest LLM which
            is connected to internet is much more smarter than any individual
            human. <br />
            So what makes us special? If we exclude intelligence, then what are
            the differentiating factors that we as individuals possess and that
            other humans find valuable in us? <br />I think that those are a our
            own experiences, tastes, preferences, contexts and the ability to
            make decisions based on them.
          </p>
          <p className="mb-2.5">
            So what if we can augment our smart AI assistants with anything that
            we find interesting or meaningful? It can help us make better
            decisions in the same contexts as we live and think.
          </p>
          <p className="mb-2.5">
            Of course, there are already a bunch of existing hardware and
            software companies that are collecting the data of your life in the
            background. But I personally find it somewhat discomforting to have
            an app that is constantly surveilling my talks with other people, my
            screen, chats, etc. That is why I think we should be able to select
            which data will be a part of our AI augmented life and which not.
          </p>
          <p>
            With our app you don&apos;t have to be a developer or spend your time in
            order to gather the data you need into some file. You can just
            insert the link for an article, or a video, or a podcast and be sure
            that this data will added into your Knowledge Hub automatically.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}

export const metadata: Metadata = {
  title: "about sapientor",
  description:
    "Effortlessly organise your data into a Knowledge Hub ready to enhance any AI chatbot. Upload with a simple click: links, files, or notes. Navigate your knowledge with ease, engage through interactive chats, or secure it for future use. Transform how you manage information today.",
  keywords:
    "ai knowledge base, personal knowledge base, open ai knowledge base, ai knowledge management, sapientor, knowledge base, knowledge hub",
  metadataBase: new URL("https://sapientor.net"),
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "about sapientor",
    description:
      "Effortlessly organise your data into a Knowledge Hub ready to enhance any AI chatbot. Upload with a simple click: links, files, or notes. Navigate your knowledge with ease, engage through interactive chats, or secure it for future use. Transform how you manage information today.",
    url: `https://sapientor.net/about`,
  },
  twitter: {
    card: "summary_large_image",
    title: "about sapientor",
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
