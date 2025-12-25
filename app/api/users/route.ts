import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = new URLSearchParams()

    if (searchParams.get("page")) params.append("page", searchParams.get("page")!)
    if (searchParams.get("limit")) params.append("limit", searchParams.get("limit")!)
    if (searchParams.get("search")) params.append("search", searchParams.get("search")!)

    const client = getServerForumClient()
    const data = await client.request(`/users?${params.toString()}`, { method: "GET", cache: "no-store" } as any)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users", details: String(error) }, { status: 500 })
  }
}
