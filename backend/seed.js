require('dotenv').config()
const mongoose = require('mongoose')
const Product  = require('./models/Product')

const PRODUCTS = [
  {
    name: 'Void Oversized Jacket',
    category: 'men', fit: 'oversized', price: 4200,
    badge: 'New', sizes: ['S','M','L','XL'], stock: 8,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80','https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80'],
    description: 'A sculptural, oversized silhouette in 240 GSM cotton. Dropped shoulders, raw hem, minimal logo.',
    fabric: '240 GSM Cotton · Soft-washed finish · Dropped shoulders', isActive: true,
  },
  {
    name: 'Ash Drape Trouser',
    category: 'men', fit: 'regular', price: 2800, originalPrice: 3500,
    badge: '', sizes: ['S','M','L'], stock: 12,
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80'],
    description: 'Fluid, wide-leg trouser in ash-washed linen blend. Elastic waist, deep pockets.',
    fabric: 'Linen Blend · Ash-wash · Relaxed seat', isActive: true,
  },
  {
    name: 'Sand Washed Tunic',
    category: 'women', fit: 'oversized', price: 1950,
    badge: 'Limited', sizes: ['XS','S','M'], stock: 4,
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80'],
    description: 'A barely-there tunic with raw edge hem and boxy body. Wear alone or over a slip.',
    fabric: 'Cotton Gauze · Raw hem · Hand-washed', isActive: true,
  },
  {
    name: 'Rare Cocoon Coat',
    category: 'women', fit: 'oversized', price: 5600, originalPrice: 7000,
    badge: 'Drop 01', sizes: ['S','M','L','XL'], stock: 6,
    images: ['https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80'],
    description: 'Statement cocoon silhouette. Unlined, structured, rare. A single garment that carries a room.',
    fabric: 'Wool Blend · Unlined · Dry clean only', isActive: true,
  },
  {
    name: 'Dust Linen Shirt',
    category: 'men', fit: 'regular', price: 1750,
    badge: '', sizes: ['S','M','L','XL','XXL'], stock: 20,
    images: ['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80'],
    description: 'Relaxed linen shirt. Wrinkles are a feature, not a flaw.',
    fabric: '100% Linen · Enzyme washed · Button-through', isActive: true,
  },
  {
    name: 'Ivory Slip Dress',
    category: 'women', fit: 'slim', price: 2200,
    badge: 'New', sizes: ['XS','S','M','L'], stock: 9,
    images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80'],
    description: 'Cut-on-the-bias ivory slip. Worn alone or under the Cocoon Coat.',
    fabric: 'Viscose Satin · Bias cut · Hand wash cold', isActive: true,
  },
  {
    name: 'Worn Denim Jacket',
    category: 'surplus', fit: 'oversized', price: 3200, originalPrice: 4500,
    badge: 'Surplus', sizes: ['M','L','XL'], stock: 3,
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80'],
    description: 'Deadstock denim sourced and reworked. One of three. When it\'s gone, it\'s gone.',
    fabric: '12oz Deadstock Denim · Reworked · Unique piece', isActive: true,
  },
  {
    name: 'Raw Edge Tee',
    category: 'men', fit: 'oversized', price: 980,
    badge: '', sizes: ['S','M','L','XL'], stock: 25,
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'],
    description: 'The simplest thing we make. The hardest to get right. 220 GSM, garment-dyed, raw cut hem.',
    fabric: '220 GSM Cotton · Raw-cut hem · Garment dyed', isActive: true,
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✦ MongoDB connected')

    await Product.deleteMany({})
    console.log('✦ Cleared existing products')

    const created = await Product.insertMany(PRODUCTS)
    console.log(`✦ Seeded ${created.length} products`)

    mongoose.disconnect()
    console.log('✦ Done! Database seeded for DUST·N·RARE')
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
}

seed()
