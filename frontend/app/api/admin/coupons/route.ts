import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// Auth helper
function getPassword(req: NextRequest) {
  return req.headers.get('x-admin-password') || ''
}
function isAuthed(pw: string) {
  return pw === process.env.ADMIN_PASSWORD
}

// GET — list all coupons
export async function GET(req: NextRequest) {
  const pw = getPassword(req)
  if (!isAuthed(pw)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Coupons fetch error:', error)
    return NextResponse.json({ message: 'Failed to fetch coupons' }, { status: 500 })
  }

  return NextResponse.json({ coupons: data || [] })
}

// POST — create a coupon
export async function POST(req: NextRequest) {
  const pw = getPassword(req)
  if (!isAuthed(pw)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { code, discount_type, discount_value, min_order, max_uses, expires_at } = body

    if (!code || !discount_type || !discount_value) {
      return NextResponse.json({ message: 'Code, type, and value are required' }, { status: 400 })
    }

    const sanitizedCode = String(code).trim().toUpperCase()
    if (!/^[A-Z0-9_-]+$/.test(sanitizedCode) || sanitizedCode.length > 30) {
      return NextResponse.json({ message: 'Invalid coupon code format. Use letters, numbers, dashes, underscores only.' }, { status: 400 })
    }

    if (!['percentage', 'flat'].includes(discount_type)) {
      return NextResponse.json({ message: 'discount_type must be percentage or flat' }, { status: 400 })
    }

    const numValue = Number(discount_value)
    if (isNaN(numValue) || numValue <= 0) {
      return NextResponse.json({ message: 'discount_value must be positive' }, { status: 400 })
    }

    if (discount_type === 'percentage' && numValue > 100) {
      return NextResponse.json({ message: 'Percentage discount cannot exceed 100' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('coupons')
      .insert({
        code: sanitizedCode,
        discount_type,
        discount_value: numValue,
        min_order: Number(min_order) || 0,
        max_uses: Number(max_uses) || -1,
        expires_at: expires_at || null,
        is_active: true,
        used_count: 0,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Coupon code already exists' }, { status: 409 })
      }
      console.error('Coupon create error:', error)
      return NextResponse.json({ message: 'Failed to create coupon' }, { status: 500 })
    }

    return NextResponse.json({ coupon: data })
  } catch (err: any) {
    console.error('Coupon create error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// PATCH — update coupon (toggle active, etc)
export async function PATCH(req: NextRequest) {
  const pw = getPassword(req)
  if (!isAuthed(pw)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) return NextResponse.json({ message: 'Coupon ID required' }, { status: 400 })

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Coupon update error:', error)
      return NextResponse.json({ message: 'Failed to update coupon' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

// DELETE — remove coupon
export async function DELETE(req: NextRequest) {
  const pw = getPassword(req)
  if (!isAuthed(pw)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ message: 'Coupon ID required' }, { status: 400 })

    const supabase = createServiceClient()
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Coupon delete error:', error)
      return NextResponse.json({ message: 'Failed to delete coupon' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
