import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Testimonials fetch error:', error)
      return NextResponse.json({ message: 'Failed to fetch testimonials' }, { status: 500 })
    }

    return NextResponse.json({ testimonials: data || [] })
  } catch (err: any) {
    console.error('Testimonials general error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
