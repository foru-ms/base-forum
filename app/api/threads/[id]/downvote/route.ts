import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const body = await request.json().catch(() => ({}))

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = getServerForumClient(token)
    const user = await client.auth.me()
    const data = await client.threads.downvote(id, user.id, body.extendedData)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to downvote thread" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = getServerForumClient(token)
    const user = await client.auth.me()
    const data = await client.threads.undownvote(id, user.id)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove downvote" }, { status: 500 })
  }
}
