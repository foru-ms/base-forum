export const dynamic = "force-dynamic"
export const revalidate = 0

import { type NextRequest, NextResponse } from "next/server"

import { getServerForumClient } from "@/lib/forum-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    const client = getServerForumClient(token)
    const data = await client.auth.resetPassword(body)

    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
