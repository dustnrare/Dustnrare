-- ══════════════════════════════════════════════════════════════
-- DUST·N·RARE — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════

-- ── PRODUCTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('men','women','surplus')) NOT NULL,
  fit TEXT CHECK (fit IN ('oversized','regular','slim')) DEFAULT 'regular',
  price INTEGER NOT NULL CHECK (price >= 0),
  original_price INTEGER,
  badge TEXT DEFAULT '',
  sizes TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  fabric TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  sold_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ORDERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal INTEGER NOT NULL DEFAULT 0,
  shipping INTEGER DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  customer_name TEXT,
  customer_phone TEXT,
  address JSONB,
  payment_method TEXT DEFAULT 'whatsapp',
  status TEXT DEFAULT 'placed' CHECK (status IN ('placed','confirmed','packed','shipped','delivered','cancelled','returned')),
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ─────────────────────────────────────
-- Products: anyone can read active products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Orders: only accessible via service role (API routes)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- No public policy = all access goes through service role key in API routes

-- ── INDEXES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- ── STORAGE BUCKET ──────────────────────────────────────────
-- Create this manually in Supabase Dashboard:
-- Storage → Create bucket → "product-images" → Public bucket

-- ══════════════════════════════════════════════════════════════
-- SEED DATA (Optional — run after creating tables)
-- ══════════════════════════════════════════════════════════════

INSERT INTO products (name, category, fit, price, original_price, badge, sizes, stock, images, description, fabric, is_active) VALUES
(
  'Void Oversized Jacket',
  'men', 'oversized', 4200, NULL, 'New',
  ARRAY['S','M','L','XL'], 8,
  ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80','https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80'],
  'A sculptural, oversized silhouette in 240 GSM cotton. Dropped shoulders, raw hem, minimal logo.',
  '240 GSM Cotton · Soft-washed finish · Dropped shoulders', true
),
(
  'Ash Drape Trouser',
  'men', 'regular', 2800, 3500, '',
  ARRAY['S','M','L'], 12,
  ARRAY['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80'],
  'Fluid, wide-leg trouser in ash-washed linen blend. Elastic waist, deep pockets.',
  'Linen Blend · Ash-wash · Relaxed seat', true
),
(
  'Sand Washed Tunic',
  'women', 'oversized', 1950, NULL, 'Limited',
  ARRAY['XS','S','M'], 4,
  ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80'],
  'A barely-there tunic with raw edge hem and boxy body. Wear alone or over a slip.',
  'Cotton Gauze · Raw hem · Hand-washed', true
),
(
  'Rare Cocoon Coat',
  'women', 'oversized', 5600, 7000, 'Drop 01',
  ARRAY['S','M','L','XL'], 6,
  ARRAY['https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80'],
  'Statement cocoon silhouette. Unlined, structured, rare. A single garment that carries a room.',
  'Wool Blend · Unlined · Dry clean only', true
),
(
  'Dust Linen Shirt',
  'men', 'regular', 1750, NULL, '',
  ARRAY['S','M','L','XL','XXL'], 20,
  ARRAY['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80'],
  'Relaxed linen shirt. Wrinkles are a feature, not a flaw.',
  '100% Linen · Enzyme washed · Button-through', true
),
(
  'Ivory Slip Dress',
  'women', 'slim', 2200, NULL, 'New',
  ARRAY['XS','S','M','L'], 9,
  ARRAY['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80'],
  'Cut-on-the-bias ivory slip. Worn alone or under the Cocoon Coat.',
  'Viscose Satin · Bias cut · Hand wash cold', true
),
(
  'Worn Denim Jacket',
  'surplus', 'oversized', 3200, 4500, 'Surplus',
  ARRAY['M','L','XL'], 3,
  ARRAY['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80'],
  'Deadstock denim sourced and reworked. One of three. When it''s gone, it''s gone.',
  '12oz Deadstock Denim · Reworked · Unique piece', true
),
(
  'Raw Edge Tee',
  'men', 'oversized', 980, NULL, '',
  ARRAY['S','M','L','XL'], 25,
  ARRAY['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'],
  'The simplest thing we make. The hardest to get right. 220 GSM, garment-dyed, raw cut hem.',
  '220 GSM Cotton · Raw-cut hem · Garment dyed', true
);
