import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next/types"

import { StatusBadge } from "@/components/common/status-badge"
import { Footer } from "@/components/layout/footer"

const gpt_link =
  process.env.GPT_URL ?? "https://chat.openai.com/g/g-rGJvqSptw-sapientor"

export default function Page() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-5 py-20 min-h-screen">
        <h1 className="text-2xl font-medium sm:text-3xl mb-10">Tutorial</h1>
        <section className="mb-5 border-b">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2.5">
            Authorisation
          </h2>
          <p className="mb-2.5">
            To start using sapientor app - you need to authorise first. You can
            do so by clicking &quot;Log in&quot; button in the top right corner
            or by clicking &quot;Get Started&quot; button on the home screen.
            For authorisation we currently provide 2 options:
          </p>
          <ul className="list-disc list-inside">
            <li>
              Email authorisation. You need to enter your email and submit the
              form. After it - you will receive an email with Sign In link.
            </li>
            <li>
              Google authorisation. Just click Google button and authorise using
              one of your Google accounts.
            </li>
          </ul>
          <Image
            src="/tutorial/auth.png"
            alt="Authorisation options"
            width={500}
            height={300}
            className="mx-auto rounded-md"
          />
        </section>
        <section className="mb-5 py-5 border-b">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2.5">
            Populating your Knowledge Hub
          </h2>
          <p>
            After successful authorisation you will be redirected to the home
            screen. It will now look differently. Now you will have to select
            what will be the source for your data:
          </p>
          <Image
            src="/tutorial/tabs.png"
            alt="Parsing tabs options"
            width={400}
            height={300}
            className="mx-auto rounded-md"
          />
          <ol className="list-decimal list-inside mb-5">
            <li>
              <b>Link.</b> Provide a URL to an article, essay, news, youtube
              video, etc.
            </li>
            <li>
              <b>File.</b> You can upload a file with text content. Currently we
              support PDF, CSV, DOCX, XLSX, TXT formats.
            </li>
            <li>
              <b>Note.</b> Paste any text note into the textarea.
            </li>
          </ol>
          <p>
            After you input your data into Link or File tab you will see 2 new
            blocks appearing:
          </p>
          <div>
            <Image
              src="/tutorial/link-blocks.png"
              alt="Link parsing additional blocks"
              width={400}
              height={300}
              className="mx-auto rounded-md"
            />
            <Image
              src="/tutorial/file-blocks.png"
              alt="File upload additional blocks"
              width={400}
              height={300}
              className="mx-auto rounded-md"
            />
          </div>
          <ul className="list-disc list-inside">
            <li>First block is a preview of the content you provided.</li>
            <li>Second one is an estimation block with a Submit button.</li>
          </ul>
          <p>
            Estimation gives you an idea of how much time at maximum it will
            take to parse the content you provided and add into your Knowledge
            Hub. Normally it should happen below that threshold but it&apos;s
            good to know how much time it will take at worst, in case the
            website you provided is restrictive or the content is not a text,
            but a video, for example.
          </p>
        </section>
        <section className="mb-5 border-b">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2.5">
            Navigation
          </h2>
          <p className="mb-2.5">
            Once you are logged in, your navigation dropdown is always available
            by clicking on your user profile icon in the top right corner.
          </p>
          <Image
            src="/tutorial/navigation.png"
            alt="File upload additional blocks"
            width={800}
            height={500}
            className="mx-auto rounded-md"
          />
        </section>
        <section className="mb-5 border-b">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2.5">
            Knowledge Hub
          </h2>
          <p className="mb-2.5">
            You can always access your Knowledge Hub by clicking on the
            &quot;Knowledge Hub&quot; button in the navigation dropdown. On the
            Knowledge Hub page you will the list containing all of your previous
            submissions with the creation date and current status.
          </p>
          <Image
            src="/tutorial/knowledge-hub.png"
            alt="Knowledge Hub view"
            width={800}
            height={500}
            className="mx-auto rounded-md"
          />
          <p className="mb-2.5">There are the following statuses:</p>
          <ul className="list-disc list-inside grid gap-2.5 mb-2.5">
            <li>
              <StatusBadge status="PENDING" className="inline-flex" /> - means
              that the content is currently being processed.
            </li>
            <li>
              <StatusBadge status="COMPLETED" className="inline-flex" /> - means
              that the content was successfully processed and added to your
              Knowledge Hub.
            </li>
            <li>
              <StatusBadge status="REJECTED" className="inline-flex" /> - means
              that the content was rejected by the system. It can happen if the
              content is inaccessible, hard to parse, too big or any of other
              reason. Precise reason will be provided for each rejection.
            </li>
          </ul>
          <p>
            By clicking on the 3 dots icon at the end of each row - you can have
            access to actions with your entry. You can copy the URL, you can
            view it or you can delete the entry from your knowledge hub.
          </p>
          <Image
            src="/tutorial/entry-actions.png"
            alt="Knowledge Hub view"
            width={300}
            height={200}
            className="mx-auto rounded-md"
          />
          <p>
            Also, you can download your Knowledge Hub in JSON format at any time
            by clicking on &quot;Download Knowledge Hub&quot; button. Please,
            note that the button appear once you have at least 1 entry which was
            successfully processed, added to your Knowledge Hub and has a
            Completed status.
          </p>
          <Image
            src="/tutorial/download-button.png"
            alt="Knowledge Hub view"
            width={300}
            height={200}
            className="mx-auto rounded-md"
          />
        </section>
        <section className="mb-5 py-5 border-b">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2.5">
            Custom GPT in ChatGPT
          </h2>
          <Image
            src="/tutorial/custom-gpt.png"
            alt="Custom GPT view"
            width={500}
            height={300}
            className="mx-auto rounded-md my-5"
          />
          <p>
            We have a{" "}
            <a href={gpt_link} className="font-semibold hover:underline">
              Custom GPT
            </a>{" "}
            created inside the ChatGPT. So if you are a paid ChatGPT user - you
            can use ChatGPT with connection to your Knowledge Hub. All the
            necessary steps for setup are described in{" "}
            <Link href="/connect-gpt" className="font-semibold hover:underline">
              this page
            </Link>
            . When using our Custom GPT you can be sure that you are connected
            to the latest version of your Knowledge Hub.
          </p>
          <Image
            src="/tutorial/connect-instructions.png"
            alt="Connect GPT page view"
            width={600}
            height={400}
            className="mx-auto rounded-md my-5"
          />
          <Image
            src="/tutorial/custom-gpt-auth.png"
            alt="Custom GPT view"
            width={500}
            height={300}
            className="mx-auto rounded-md my-5"
          />
          <p className="mb-2.5">
            When using our Custom GPT you can ask questions that are related to
            your knowledge hub. You can add entries to your Knowledge Hub via
            chat interface by just pasting in the link.
          </p>
          <Image
            src="/tutorial/gpt-link-parse.png"
            alt="GPT parsing link"
            width={500}
            height={300}
            className="mx-auto rounded-md"
          />
        </section>
        <section>
          <h2 className="text-lg sm:text-xl font-semibold mb-2.5">
            Our native Chat
          </h2>
          <p>
            We also have a simple chat interface built in. You can access it by
            clicking a &quot;Chat&quot; in the navigation dropdown. Chat uses
            not a fancy model and currently is here just for you to talk with
            your Knowledge Hub. But for smoother experience at the moment we
            recommend using ChatGPT with our Sapientor extension.
          </p>
          <Image
            src="/tutorial/our-chat.png"
            alt="Chat page view"
            width={500}
            height={300}
            className="mx-auto rounded-md my-5"
          />
        </section>
      </main>
      <Footer />
    </>
  )
}

export const metadata: Metadata = {
  title: "sapientor tutorial",
  description:
    "Effortlessly organise your data into a Knowledge Hub ready to enhance any AI chatbot. Upload with a simple click: links, files, or notes. Navigate your knowledge with ease, engage through interactive chats, or secure it for future use. Transform how you manage information today.",
  keywords:
    "data organization, Knowledge Hub, AI chatbot enhancement, easy upload, interactive chats, information management, secure data storage, sapientor, knowledge base, knowledge hub",
  metadataBase: new URL("https://sapientor.net"),
  alternates: {
    canonical: "/tutorial",
  },
  openGraph: {
    title: "sapientor tutorial",
    description:
      "Effortlessly organise your data into a Knowledge Hub ready to enhance any AI chatbot. Upload with a simple click: links, files, or notes. Navigate your knowledge with ease, engage through interactive chats, or secure it for future use. Transform how you manage information today.",
    url: `https://sapientor.net/tutorial`,
  },
  twitter: {
    card: "summary_large_image",
    title: "sapientor tutorial",
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
