import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const client = getServerForumClient()
    const data = await client.posts.list({
      ...(searchParams.get("threadId") && { threadId: searchParams.get("threadId")! }),
      ...(searchParams.get("userId") && { userId: searchParams.get("userId")! }),
      ...(searchParams.get("cursor") && { cursor: searchParams.get("cursor")! }),
      ...(searchParams.get("limit") && { limit: parseInt(searchParams.get("limit")!) }),
      ...(searchParams.get("filter") && { filter: searchParams.get("filter")! as 'newest' | 'oldest' }),
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()

    const client = getServerForumClient(token)
    const data = await client.posts.create(body)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post", details: String(error) }, { status: 500 })
  }
}
