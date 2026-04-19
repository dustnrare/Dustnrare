import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function getPassword(req: NextRequest) {
  return req.headers.get('x-admin-password') || ''
}

function isAuthed(pw: string) {
  return pw === process.env.ADMIN_PASSWORD
}

// GET all testimonials (including inactive)
export async function GET(req: NextRequest) {
  const pw = getPassword(req)
  if (!isAuthed(pw)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Testimonial admin fetch error:', error)
    return NextResponse.json({ message: 'Failed to fetch testimonials' }, { status: 500 })
  }

  return NextResponse.json({ testimonials: data || [] })
}

// POST new testimonial
export async function POST(req: NextRequest) {
  const pw = getPassword(req)
  if (!isAuthed(pw)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { stars, text, author, location, product } = body

    if (!stars || !text || !author || !location || !product) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        stars: Number(stars),
        text,
        author,
        location,
        product,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Testimonial create error:', error)
      return NextResponse.json({ message: 'Failed to create testimonial' }, { status: 500 })
    }

    return NextResponse.json({ testimonial: data })
  } catch (err: any) {
    console.error('Testimonial create error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// PATCH update testimonial
export async function PATCH(req: NextRequest) {
  const pw = getPassword(req)
  if (!isAuthed(pw)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ message: 'Testimonial ID required' }, { status: 400 })

    const allowed = ['stars', 'text', 'author', 'location', 'product', 'is_active']
    const update: any = { updated_at: new Date().toISOString() }
    for (const key of allowed) {
      if (updates[key] !== undefined) update[key] = updates[key]
    }

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('testimonials')
      .update(update)
      .eq('id', id)

    if (error) {
      console.error('Testimonial update error:', error)
      return NextResponse.json({ message: 'Failed to update testimonial' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// DELETE testimonial
export async function DELETE(req: NextRequest) {
  const pw = getPassword(req)
  if (!isAuthed(pw)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ message: 'Testimonial ID required' }, { status: 400 })

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Testimonial delete error:', error)
      return NextResponse.json({ message: 'Failed to delete testimonial' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
