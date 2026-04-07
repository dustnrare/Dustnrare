import { supabase } from './supabase'

// ─── PRODUCTS ────────────────────────────────────────────────

export const productsApi = {
  async getAll(params?: {
    category?: string
    sizes?: string
    fit?: string
    maxPrice?: number
    sort?: string
    limit?: number
  }) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (params?.category) {
      const cats = params.category.split(',')
      query = query.in('category', cats)
    }

    if (params?.fit) {
      const fits = params.fit.split(',')
      query = query.in('fit', fits)
    }

    if (params?.maxPrice) {
      query = query.lte('price', params.maxPrice)
    }

    if (params?.limit) {
      query = query.limit(params.limit)
    }

    // Sort
    if (params?.sort === 'price-asc') {
      query = query.order('price', { ascending: true })
    } else if (params?.sort === 'price-desc') {
      query = query.order('price', { ascending: false })
    } else if (params?.sort === 'newest') {
      query = query.order('created_at', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async getOne(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getLookbook() {
    const res = await fetch('/api/lookbook', { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch lookbook')
    const data = await res.json()
    return data.lookbook || []
  },

  async search(q: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`)
      .limit(12)

    if (error) throw error
    return data || []
  },
}

// ─── ORDERS (client-side helper) ─────────────────────────────

export const ordersApi = {
  async create(orderData: {
    items: { productId: string; name: string; image: string; size: string; qty: number; price: number }[]
    address: {
      name: string; phone: string;
      line1: string; line2: string;
      city: string; state: string; pincode: string
    }
    paymentMethod: 'whatsapp' | 'email'
    subtotal: number
    shipping: number
    total: number
  }) {
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.message || 'Failed to place order')
    }
    return res.json()
  },
}

// ─── ADMIN API ───────────────────────────────────────────────

export const adminApi = {
  async verifyPassword(password: string) {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    return res.ok
  },

  async getProducts(password: string) {
    const res = await fetch('/api/admin/products', {
      headers: { 'x-admin-password': password },
    })
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
  },

  async createProduct(password: string, data: object) {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.message || 'Failed to create product')
    }
    return res.json()
  },

  async updateProduct(password: string, id: string, data: Record<string, unknown>) {
    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id, ...data }),
    })
    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.message || 'Failed to update product')
    }
    return res.json()
  },

  async deleteProduct(password: string, id: string) {
    const res = await fetch(`/api/admin/products?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    })
    if (!res.ok) throw new Error('Failed to delete product')
    return res.json()
  },

  async getOrders(password: string) {
    const res = await fetch('/api/admin/orders', {
      headers: { 'x-admin-password': password },
    })
    if (!res.ok) throw new Error('Failed to fetch orders')
    return res.json()
  },

  async updateOrder(password: string, id: string, data: { status?: string; tracking_number?: string }) {
    const res = await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id, ...data }),
    })
    if (!res.ok) throw new Error('Failed to update order')
    return res.json()
  },

  async uploadImages(password: string, files: File[]) {
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-password': password },
      body: formData,
    })
    if (!res.ok) throw new Error('Upload failed')
    return res.json()
  },

  async getLookbook(password: string) {
    const res = await fetch('/api/admin/lookbook', {
      headers: { 'x-admin-password': password }
    })
    if (!res.ok) throw new Error('Failed to fetch lookbook')
    const data = await res.json()
    return data.lookbook || []
  },

  async createLookbookItem(password: string, data: any) {
    const res = await fetch('/api/admin/lookbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create lookbook item')
    return res.json()
  },

  async deleteLookbookItem(password: string, id: string) {
    const res = await fetch(`/api/admin/lookbook?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    })
    if (!res.ok) throw new Error('Failed to delete lookbook item')
    return res.json()
  }
}
