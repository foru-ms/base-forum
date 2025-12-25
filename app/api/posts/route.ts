import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = new URLSearchParams()

    if (searchParams.get("threadId")) params.append("threadId", searchParams.get("threadId")!)
    if (searchParams.get("userId")) params.append("userId", searchParams.get("userId")!)
    if (searchParams.get("page")) params.append("page", searchParams.get("page")!)
    if (searchParams.get("limit")) params.append("limit", searchParams.get("limit")!)

    const client = getServerForumClient()
    const data = await client.posts.list({
      ...(searchParams.get("threadId") && { threadId: searchParams.get("threadId")! }),
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
