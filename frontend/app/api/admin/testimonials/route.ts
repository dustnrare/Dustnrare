import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function checkAdmin(req: NextRequest) {
  const pw = req.headers.get('x-admin-password')
  return pw === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ testimonials: data })
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const body = await req.json()
  const { data, error } = await supabase.from('testimonials').insert({
    stars: Number(body.stars) || 5,
    text: body.text,
    author: body.author,
    location: body.location,
    product: body.product,
    is_active: body.is_active ?? true,
  }).select().single()
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ testimonial: data })
}

export async function PATCH(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const body = await req.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
  const { data, error } = await supabase.from('testimonials').update(fields).eq('id', id).select().single()
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ testimonial: data })
}

export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
  const supabase = createServiceClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
