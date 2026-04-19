import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, subtotal } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ message: 'Coupon code is required' }, { status: 400 })
    }

    const sanitizedCode = code.trim().toUpperCase()
    if (sanitizedCode.length > 30 || !/^[A-Z0-9_-]+$/.test(sanitizedCode)) {
      return NextResponse.json({ message: 'Invalid coupon code format' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Use parameterized query via Supabase SDK (no SQL injection risk)
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', sanitizedCode)
      .eq('is_active', true)
      .single()

    if (error || !coupon) {
      return NextResponse.json({ message: 'Invalid or expired coupon code' }, { status: 404 })
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ message: 'This coupon has expired' }, { status: 400 })
    }

    // Check max uses
    if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ message: 'This coupon has reached its usage limit' }, { status: 400 })
    }

    // Check minimum order
    if (coupon.min_order > 0 && subtotal < coupon.min_order) {
      return NextResponse.json({
        message: `Minimum order of ₹${coupon.min_order.toLocaleString()} required for this coupon`
      }, { status: 400 })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discount_value) / 100)
      // Cap at subtotal
      discountAmount = Math.min(discountAmount, subtotal)
    } else {
      // Flat discount
      discountAmount = Math.min(coupon.discount_value, subtotal)
    }

    return NextResponse.json({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discountAmount,
      message: 'Coupon applied successfully',
    })

  } catch (err: any) {
    console.error('Coupon validation error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
