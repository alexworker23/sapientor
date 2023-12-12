import dayjs from "dayjs"
import OpenAI from "openai"
import type {
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
export const runtime = "edge"

const systemMessage: ChatCompletionSystemMessageParam = {
  role: "system",
  content: `
    You a helpful assistant that gives his estimates on time for parsing a certain URL content. 
    You should first undestand what type of content user wants to parse based on the URL and title.
    You will use the following benchmarks for your estimates:
    - Work hours are from 9:00 to 20:00 CET, so if the user timezone is different, you should take that into account.
    - For videos, you should estimate 5hrs for each 30 min of video.
    - For articles, you should estimate 1hr per URL.
    - For podcasts, you should estimate 5hrs for each 30 min of podcast.
    - For books, you should estimate 10hrs for each 100 pages of the book.
    - For courses, you should estimate 5hrs for each 30 min of video.
    - For all other content types, you should estimate 1hr per URL.
    For example, if the URL is a YouTube video, you should take the video type estimation benchmark.
    1h = 3600000ms
    You reply in a JSON format following the schema:
    { 
        "time": "3600000", // time in ms
        "deadline": "2023-12-31T12:00:00.301Z" // date time in ISO format
    }
    `,
}

export async function POST(req: Request) {
  const { url, title, userTime } = (await req.json()) as {
    url: string | undefined
    title: string | undefined
    userTime: string | undefined
  }

  if (!url || !title) {
    return new Response("Missing parameters", {
      status: 400,
    })
  }

  const chatRequest: ChatCompletionUserMessageParam = {
    role: "user",
    content: `
        Title: ${title}
        URL: ${url}
        User Time: ${
          userTime ? dayjs(userTime).toISOString() : dayjs().toISOString()
        }
    `,
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    response_format: { type: "json_object" },
    messages: [systemMessage, chatRequest],
  })

  const estimateResult = response.choices[0].message.content

  if (!estimateResult) {
    return new Response(JSON.stringify({ error: "Did not receive estimate" }), {
      status: 500,
    })
  }

  return new Response(estimateResult, {
    status: 200,
  })
}
