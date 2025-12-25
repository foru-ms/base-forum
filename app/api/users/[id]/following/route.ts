import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const cursor = searchParams.get("cursor")
    const filter = searchParams.get("filter")

    const client = getServerForumClient()
    const data = await client.users.getFollowing(id, {
      ...(query && { query }),
      ...(cursor && { cursor }),
      ...(filter && { filter: filter as 'newest' | 'oldest' }),
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch following", details: String(error) }, { status: 500 })
  }
}
