export const dynamic = "force-dynamic"
export const revalidate = 0

import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const client = getServerForumClient()
    const data = await client.auth.register(body)
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("[v0] Register API exception:", error)
    return NextResponse.json({ error: "Registration failed", details: String(error) }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
