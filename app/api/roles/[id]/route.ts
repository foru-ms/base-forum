export const dynamic = "force-dynamic"
export const revalidate = 0

import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.FORU_MS_API_URL
const API_KEY = process.env.FORU_MS_API_KEY

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: { "Cache-Control": "no-store" } })
    }

    const res = await fetch(`${API_URL}/role/${id}`, {
      headers: {
        "x-api-key": API_KEY!,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      const error = await res.text()
      return NextResponse.json({ error: "Failed to fetch role", details: error }, { status: res.status, headers: { "Cache-Control": "no-store" } })
    }

    const data = await res.json()
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch role", details: String(error) }, { status: 500, headers: { "Cache-Control": "no-store" } })
  }
}
