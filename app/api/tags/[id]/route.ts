import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const client = getServerForumClient()
    const data = await client.request(`/tag/${id}`, { method: "GET", cache: "no-store" } as any)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tag", details: String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()

    const client = getServerForumClient(token)
    const data = await client.request(`/tag/${id}`, { method: "PUT", body: JSON.stringify(body) })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tag", details: String(error) }, { status: 500 })
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
    await client.request(`/tag/${id}`, { method: "DELETE" })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tag", details: String(error) }, { status: 500 })
  }
}
