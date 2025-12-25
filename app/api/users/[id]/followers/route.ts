import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const cursor = searchParams.get("cursor")

    const url = new URL(`/user/${id}/followers`, "http://internal")
    if (query) url.searchParams.set("query", query)
    if (cursor) url.searchParams.set("cursor", cursor)

    const client = getServerForumClient()
    const data = await client.request(`${url.pathname}${url.search}`, { method: "GET", cache: "no-store" } as any)
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
    const data = await client.request(`/user/${id}/followers`, { method: "POST", body: JSON.stringify(body) })
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
    await client.request(`/user/${id}/followers`, { method: "DELETE" })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to unfollow user", details: String(error) }, { status: 500 })
  }
}
