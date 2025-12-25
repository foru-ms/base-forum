import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest) {
  try {
    const client = getServerForumClient()
    const data = await client.request("/stats", { method: "GET" })
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
