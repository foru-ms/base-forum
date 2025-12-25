import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = getServerForumClient(token)
    const searchParams = request.nextUrl.searchParams
    const data = await client.roles.list({
      ...(searchParams.get("cursor") && { cursor: searchParams.get("cursor")! }),
      ...(searchParams.get("filter") && { filter: searchParams.get("filter")! as 'newest' | 'oldest' }),
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Roles API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const client = getServerForumClient(token)
    const data = await client.roles.create(body)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Create role error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
