import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest) {
  try {
    const client = getServerForumClient()
    const searchParams = request.nextUrl.searchParams
    const data = await client.stats.get({
      ...(searchParams.get("filter") && { filter: searchParams.get("filter")! }),
      ...(searchParams.get("threadCursor") && { threadCursor: searchParams.get("threadCursor")! }),
      ...(searchParams.get("postCursor") && { postCursor: searchParams.get("postCursor")! }),
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
