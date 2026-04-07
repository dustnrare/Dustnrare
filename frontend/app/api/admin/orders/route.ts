import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function checkAdmin(req: NextRequest) {
  const pw = req.headers.get('x-admin-password')
  return pw === process.env.ADMIN_PASSWORD
}

// GET — list all orders
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })

  // Calculate revenue from confirmed+ orders
  const revenue = (data || [])
    .filter((o: any) => ['confirmed', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum: number, o: any) => sum + (o.total || 0), 0)

  return NextResponse.json({ orders: data || [], total: data?.length || 0, revenue })
}

// PUT — update order status / tracking
export async function PUT(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const body = await req.json()
  const { id, status, tracking_number } = body

  if (!id) return NextResponse.json({ message: 'Missing order id' }, { status: 400 })

  const update: any = { updated_at: new Date().toISOString() }
  if (status) update.status = status
  if (tracking_number !== undefined) update.tracking_number = tracking_number

  const { data, error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ order: data })
}
