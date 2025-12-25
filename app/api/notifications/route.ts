import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = getServerForumClient(token)
    const user = await client.auth.me()
    const searchParams = request.nextUrl.searchParams
    const data = await client.notifications.list({
      userId: user.id,
      ...(searchParams.get("read") && { read: searchParams.get("read") === "true" }),
      ...(searchParams.get("cursor") && { cursor: searchParams.get("cursor")! }),
      ...(searchParams.get("filter") && { filter: searchParams.get("filter")! as 'newest' | 'oldest' }),
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Notifications API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
