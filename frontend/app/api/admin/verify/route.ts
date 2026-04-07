import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ message: 'Invalid password' }, { status: 401 })
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }
}
