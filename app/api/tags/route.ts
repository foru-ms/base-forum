export const revalidate = 300

import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET() {
  try {
    const client = getServerForumClient()
    const data = await client.request("/tags", { method: "GET", next: { revalidate } } as any)
    return NextResponse.json(data, {
      headers: { "Cache-Control": `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}` },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tags", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const body = await request.json()

    const client = getServerForumClient(token)
    const data = await client.request("/tags", { method: "POST", body: JSON.stringify(body) })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tag", details: String(error) }, { status: 500 })
  }
}
