import type { LinkMetadata } from "@/lib/types"

export async function POST(request: Request) {
  const { url } = (await request.json()) as { url: string }

  const response = await fetch(url)
  const html = await response.text()

  const titleMatch = html.match(/<title>(.*?)<\/title>/)
  const descMatch = html.match(/<meta name="description" content="(.*?)"/)
  const faviconMatch = html.match(/<link rel="icon" href="(.*?)"/)

  const metadata: LinkMetadata = {
    title: titleMatch ? titleMatch[1] : url,
    description: descMatch ? descMatch[1] : "",
    favicon: faviconMatch ? faviconMatch[1] : "",
    url,
  }

  return new Response(JSON.stringify(metadata), {
    status: 200,
  })
}
