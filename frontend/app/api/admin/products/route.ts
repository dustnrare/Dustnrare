import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function checkAdmin(req: NextRequest) {
  const pw = req.headers.get('x-admin-password')
  return pw === process.env.ADMIN_PASSWORD
}

// GET — list all products (including inactive)
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ products: data })
}

// POST — create product
export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: body.name,
      category: body.category,
      fit: body.fit || 'regular',
      price: Number(body.price),
      original_price: body.originalPrice ? Number(body.originalPrice) : null,
      badge: body.badge || '',
      sizes: body.sizes || ['S', 'M', 'L'],
      stock: Number(body.stock) || 10,
      images: body.images || [],
      description: body.description || '',
      fabric: body.fabric || '',
      is_active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}

// PATCH — update product fields (stock, price, is_active, etc.)
export async function PATCH(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const body = await req.json()
  const { id, ...fields } = body

  if (!id) return NextResponse.json({ message: 'Missing product id' }, { status: 400 })

  // Only allow safe fields to be updated
  const allowed = ['stock', 'price', 'original_price', 'badge', 'is_active', 'sizes', 'images', 'description', 'fabric', 'name', 'category', 'fit']
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  for (const key of allowed) {
    if (fields[key] !== undefined) update[key] = fields[key]
  }

  const { data, error } = await supabase
    .from('products')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}

// DELETE — delete product
export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ message: 'Missing product id' }, { status: 400 })

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ message: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
