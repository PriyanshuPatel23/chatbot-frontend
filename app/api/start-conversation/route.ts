import { NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(req: Request) {
  try {
    const res = await fetch(`${BACKEND}/start-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // forward body if any
      body: await req.text() || undefined
    })

    const text = await res.text()

    return new NextResponse(text, { status: res.status })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return new NextResponse(JSON.stringify({ error: msg }), { status: 500 })
  }
}
