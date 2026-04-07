
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load env variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase URL or Service Role Key in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const initialProducts = [
  {
    name: 'Void Oversized Jacket',
    category: 'men',
    fit: 'oversized',
    price: 4200,
    original_price: null,
    badge: 'New',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80'
    ],
    description: 'A sculptural, oversized silhouette in 240 GSM cotton. Dropped shoulders, raw hem, minimal logo.',
    fabric: '240 GSM Cotton · Soft-washed finish · Dropped shoulders',
    is_active: true
  },
  // keep rest same...
]

async function seed() {
  console.log('🌱 Seeding products...')

  const { data, error } = await supabase
    .from('products')
    .insert(initialProducts)

  if (error) {
    console.error('❌ Error inserting products:', error.message)
  } else {
    console.log('✅ Products inserted successfully')
  }
}

seed()


const initialProducts = [
  {
    name: 'Void Oversized Jacket',
    category: 'men',
    fit: 'oversized',
    price: 4200,
    original_price: null,
    badge: 'New',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80'
    ],
    description: 'A sculptural, oversized silhouette in 240 GSM cotton. Dropped shoulders, raw hem, minimal logo.',
    fabric: '240 GSM Cotton · Soft-washed finish · Dropped shoulders',
    is_active: true
  },
  {
    name: 'Ash Drape Trouser',
    category: 'men',
    fit: 'regular',
    price: 2800,
    original_price: 3500,
    badge: '',
    sizes: ['S', 'M', 'L'],
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80'
    ],
    description: 'Fluid, wide-leg trouser in ash-washed linen blend. Elastic waist, deep pockets.',
    fabric: 'Linen Blend · Ash-wash · Relaxed seat',
    is_active: true
  },
  {
    name: 'Sand Washed Tunic',
    category: 'women',
    fit: 'oversized',
    price: 1950,
    original_price: null,
    badge: 'Limited',
    sizes: ['XS', 'S', 'M'],
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80'
    ],
    description: 'A barely-there tunic with raw edge hem and boxy body. Wear alone or over a slip.',
    fabric: 'Cotton Gauze · Raw hem · Hand-washed',
    is_active: true
  },
  {
    name: 'Rare Cocoon Coat',
    category: 'women',
    fit: 'oversized',
    price: 5600,
    original_price: 7000,
    badge: 'Drop 01',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80'
    ],
    description: 'Statement cocoon silhouette. Unlined, structured, rare. A single garment that carries a room.',
    fabric: 'Wool Blend · Unlined · Dry clean only',
    is_active: true
  },
  {
    name: 'Worn Denim Jacket',
    category: 'surplus',
    fit: 'oversized',
    price: 3200,
    original_price: 4500,
    badge: 'Surplus',
    sizes: ['M', 'L', 'XL'],
    stock: 3,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80'
    ],
    description: 'Deadstock denim sourced and reworked. One of three. When it\'s gone, it\'s gone.',
    fabric: '12oz Deadstock Denim · Reworked · Unique piece',
    is_active: true
  }
]
