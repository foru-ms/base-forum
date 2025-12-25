import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const queryParams = new URLSearchParams()

    if (searchParams.get("query")) queryParams.append("query", searchParams.get("query")!)
    if (searchParams.get("cursor")) queryParams.append("cursor", searchParams.get("cursor")!)
    if (searchParams.get("filter")) queryParams.append("filter", searchParams.get("filter")!)

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""

    const client = getServerForumClient()
    const data = await client.request(`/thread/${id}/posts${queryString}`, { method: "GET", cache: "no-store" } as any)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[SERVER] Error fetching thread posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts", details: String(error) }, { status: 500 })
  }
}
