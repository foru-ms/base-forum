import "server-only"

import { ForumClient } from "@foru-ms/sdk"

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export function getServerForumClient(token?: string) {
  const client = new ForumClient({
    apiKey: requireEnv("FORU_MS_API_KEY"),
    baseUrl: process.env.FORU_MS_API_URL,
  })

  if (token) {
    client.setToken(token)
  }

  return client
}
