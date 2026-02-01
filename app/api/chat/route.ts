import { NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(req: Request) {
  try {
    // Accept JSON body and forward to backend
    const body = await req.json()

    const res = await fetch(`${BACKEND}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await res.text()
    return new NextResponse(data, { status: res.status })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return new NextResponse(JSON.stringify({ error: msg }), { status: 500 })
  }
}
