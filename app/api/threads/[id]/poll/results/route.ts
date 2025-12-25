import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    const client = getServerForumClient(token || undefined)
    const data = await client.threads.getPoll(id)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[SERVER] Failed to fetch poll results:", error)
    return NextResponse.json({ error: "Failed to fetch poll results" }, { status: 500 })
  }
}
