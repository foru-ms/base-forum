import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const body = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = getServerForumClient(token)
    const user = await client.auth.me()
    const data = await client.threads.vote(id, user.id, body.optionId)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    const body = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = getServerForumClient(token)
    const user = await client.auth.me()
    const data = await client.threads.voteUpdate(id, user.id, body.optionId)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update vote" }, { status: 500 })
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
    const data = await client.threads.unvote(id, user.id)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete vote" }, { status: 500 })
  }
}
