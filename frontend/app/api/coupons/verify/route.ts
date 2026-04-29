import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ message: 'Coupon code required' }, { status: 400 })
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()
      
    if (error || !data) return NextResponse.json({ message: 'Invalid or inactive coupon' }, { status: 400 })
    return NextResponse.json({ coupon: data })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
