import { cache } from "react"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { DataNode, DomHandler, Element, Node } from "domhandler"
import { Parser } from "htmlparser2"
import type { Document } from "langchain/document"
import { YoutubeLoader } from "langchain/document_loaders/web/youtube"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { SupabaseVectorStore } from "langchain/vectorstores/supabase"
import { Resend } from "resend"

import type { Database } from "@/lib/database.types"
import type { ParsingEstimate } from "@/lib/types"
import { splitDocuments } from "@/lib/utils"
import ComplexLinkEmail from "@/components/emails/complex-link"

const resend = new Resend(process.env.RESEND_API_KEY!)
export const maxDuration = 60

// const systemMessage: ChatCompletionSystemMessageParam = {
//   role: "system",
//   content: `You are a helpful assistant, that helps people create a summary of a webpage content.
//     You will receive a full webpage content from a user and you need to create a summary of it.
//     You outline the main points of the webpage content and send it back to the user.
//   `,
// }

const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
})

export async function POST(req: Request) {
  const { source_id } = (await req.json()) as {
    source_id: string | undefined
  }

  if (!source_id) {
    return new NextResponse(
      JSON.stringify({ error: "Source ID is required" }),
      {
        status: 400,
      }
    )
  }

  const supabase = createServerSupabaseClient()
  const embeddings = new OpenAIEmbeddings()
  const store = new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: "summaries",
  })

  const { data, error } = await supabase
    .from("sources")
    .select("url, title, description, user_id, estimate")
    .eq("id", source_id)
    .single()

  if (!data?.url || !data?.title) {
    return new NextResponse("Missing source data", {
      status: 400,
    })
  }

  const tooLongParsingTime =
    (data?.estimate as ParsingEstimate)?.time &&
    !isNaN((data?.estimate as ParsingEstimate)?.time) &&
    (data?.estimate as ParsingEstimate)?.time > 3600000

  const complexLink = data?.title && data.url && data?.title === data?.url

  if (tooLongParsingTime || complexLink) {
    await resend.emails.send({
      from: `sapientor. <feedback@sapientor.net>`,
      to: process.env.SUPPORT_EMAIL || "valoiscene@gmail.com",
      subject: `Complex link request - ${data?.title}`,
      react: (
        <ComplexLinkEmail
          url={data?.url || "No URL provided."}
          title={data?.title || "No title provided."}
          estimate={data?.estimate as ParsingEstimate}
          userId={data?.user_id || "No user provided."}
        />
      ),
    })

    if (isYouTubeURL(data.url)) {
      const loader = YoutubeLoader.createFromUrl(data.url, {
        language: "en",
        addVideoInfo: true,
      })

      const docs = await loader.load()
      const splitDocs = splitDocuments(docs)
      const docsWithMetadata = splitDocs.map((doc) => ({
        ...doc,
        metadata: {
          user_id: data.user_id,
          source_id,
          url: data.url,
          title: data.title,
        },
      }))
      const storedIds = await store.addDocuments(docsWithMetadata)

      if (storedIds.length) {
        await supabase.from("notifications").insert({
          title: "Your summary is ready!",
          description: `Your summary for "${data.title.slice(0, 50)}${
            data.title.length > 50 ? "..." : ""
          }" is done and is already added to your Knowledge Hub`,
          user_id: data.user_id,
        })
      }
      return new NextResponse(JSON.stringify({ ids: storedIds }), {
        status: 200,
      })
    }

    return new NextResponse(
      JSON.stringify({ message: "Parsing is not possible for this source" }),
      {
        status: 200,
      }
    )
  }

  if (error) {
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
    })
  }

  const content = await fetchAndParseURL(data.url)

  // summary generation functionality
  // const chatRequest: ChatCompletionUserMessageParam = {
  //   role: "user",
  //   content: `Webpage Content: ${webpageContent}`,
  // }
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4-1106-preview",
  //   messages: [systemMessage, chatRequest],
  // })
  // const summary = response.choices[0].message.content
  // const contentToSave = `
  //   ${data.title}
  //   ${data.description}
  //   ${summary}
  // `

  const doc: Document[] = [
    {
      pageContent: content,
      metadata: {
        user_id: data.user_id,
        source_id,
        url: data.url,
        title: data.title,
      },
    },
  ]

  const splitDocs = splitDocuments(doc)

  const storedIds = await store.addDocuments(splitDocs)

  await supabase.from("notifications").insert({
    title: "Your summary is ready!",
    description: `Your summary for "${data.title.slice(0, 50)}${
      data.title.length > 50 ? "..." : ""
    }" is done and is already added to your Knowledge Hub`,
    user_id: data.user_id,
  })

  return new NextResponse(JSON.stringify({ ids: storedIds }), {
    status: 200,
  })
}

function extractText(dom: Node[]): string {
  let text = ""
  dom.forEach((node) => {
    if (node instanceof Element) {
      if (
        node.tagName === "script" ||
        node.tagName === "style" ||
        node.tagName === "noscript"
      ) {
        // ignore scripts, styles, and noscript tags
      } else if (node.childNodes.length > 0) {
        // recursively get text for child nodes
        text += extractText(node.childNodes)
      }
    } else if (node instanceof DataNode) {
      text += node.data + " "
    }
  })
  // Remove all newline and tabulation characters
  text = text.replace(/[\n\t]+/g, " ").trim()

  // Optionally, replace multiple spaces with a single space
  text = text.replace(/\s+/g, " ")

  return text
}

async function fetchAndParseURL(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const html = await response.text()

    let textContent = ""
    const handler = new DomHandler((error, dom) => {
      if (error) {
        throw error
      }
      textContent = extractText(dom)
    })

    const parser = new Parser(handler)
    parser.write(html)
    parser.end()

    return textContent.trim()
  } catch (error) {
    console.error("Error fetching or parsing URL:", error)
    return ""
  }
}

function isYouTubeURL(url: string): boolean {
  const youtubeDomains = [
    "youtube.com", // Main YouTube domain
    "youtu.be", // YouTube short URLs
    "m.youtube.com", // Mobile version of YouTube
    "gaming.youtube.com", // YouTube Gaming
    "music.youtube.com", // YouTube Music
  ]

  const parsedURL = new URL(url)
  return youtubeDomains.includes(parsedURL.hostname)
}
