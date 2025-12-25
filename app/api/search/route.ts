import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()

    const client = getServerForumClient()
    const data = await client.request(`/search?${queryString}`, { method: "GET" })
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
