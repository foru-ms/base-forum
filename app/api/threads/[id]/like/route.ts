import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const client = getServerForumClient(token)
    const data = await client.request(`/thread/${id}/likes`, { method: "POST", body: JSON.stringify(body) })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to like thread", details: String(error) }, { status: 500 })
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
    const data = await client.request(`/thread/${id}/likes`, { method: "DELETE" })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove like", details: String(error) }, { status: 500 })
  }
}
