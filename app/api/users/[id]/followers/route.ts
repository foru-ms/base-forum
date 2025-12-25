import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const cursor = searchParams.get("cursor")

    const client = getServerForumClient()
    const data = await client.users.getFollowers(id, {
      ...(query && { query }),
      ...(cursor && { cursor }),
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch followers", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()

    const client = getServerForumClient(token)
    const user = await client.auth.me()
    const data = await client.users.follow(id, user.id, body.extendedData)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to follow user", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    const client = getServerForumClient(token)
    const user = await client.auth.me()
    await client.users.unfollow(id, user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to unfollow user", details: String(error) }, { status: 500 })
  }
}
