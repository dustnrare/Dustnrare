import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ─── TYPES ──────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  category: 'men' | 'women' | 'surplus'
  fit: 'oversized' | 'regular' | 'slim'
  price: number
  original_price?: number
  badge?: string
  sizes: string[]
  stock: number
  images: string[]
  description: string
  fabric: string
  is_active: boolean
}

export interface CartItem {
  product: Product
  size: string
  qty: number
}

// ─── CART STORE ─────────────────────────────────────────────
interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, size: string, qty?: number) => void
  removeItem: (productId: string, size: string) => void
  updateQty: (productId: string, size: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, size, qty = 1) => {
        const items = get().items
        const existing = items.find(i => i.product.id === product.id && i.size === size)
        if (existing) {
          set({ items: items.map(i =>
            i.product.id === product.id && i.size === size
              ? { ...i, qty: i.qty + qty }
              : i
          )})
        } else {
          set({ items: [...items, { product, size, qty }] })
        }
      },

      removeItem: (productId, size) => {
        set({ items: get().items.filter(i => !(i.product.id === productId && i.size === size)) })
      },

      updateQty: (productId, size, qty) => {
        if (qty <= 0) { get().removeItem(productId, size); return }
        set({ items: get().items.map(i =>
          i.product.id === productId && i.size === size ? { ...i, qty } : i
        )})
      },

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => get().items.reduce((sum, i) => sum + i.product.price * i.qty, 0),
      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { 
      name: 'dustnrare-cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// ─── UI STORE ───────────────────────────────────────────────
interface UIStore {
  activeGender: 'men' | 'women' | 'surplus' | 'all'
  setGender: (g: 'men' | 'women' | 'surplus' | 'all') => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      activeGender: 'men',
      setGender: (g) => set({ activeGender: g }),
    }),
    { name: 'dustnrare-ui' }
  )
)
