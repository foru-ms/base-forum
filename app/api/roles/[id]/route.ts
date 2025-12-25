export const dynamic = "force-dynamic"
export const revalidate = 0

import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    const client = getServerForumClient(token)
    const data = await client.request(`/role/${id}`, {
      method: "GET",
      cache: "no-store",
    })

    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch role", details: String(error) }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
