import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10)
      
    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ testimonials: data })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
