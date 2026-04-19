-- ══════════════════════════════════════════════════════════════
-- DUST·N·RARE — Unified Production Schema
-- ══════════════════════════════════════════════════════════════

-- ── 1. HELPERS & TRIGGERS ──
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ── 2. PRODUCTS ──
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('men','women','surplus','accessories','unisex')),
  fit TEXT DEFAULT 'regular' CHECK (fit IN ('oversized','regular','slim','relaxed')),
  price INTEGER NOT NULL CHECK (price >= 0),
  original_price INTEGER CHECK (original_price >= 0),
  badge TEXT DEFAULT '',
  sizes TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  images TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  fabric TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  sold_count INTEGER DEFAULT 0 CHECK (sold_count >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);

-- ── 3. COUPONS ──
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage','flat')),
  discount_value INTEGER NOT NULL CHECK (discount_value > 0),
  min_order INTEGER DEFAULT 0 CHECK (min_order >= 0),
  max_uses INTEGER DEFAULT -1, -- -1 for unlimited
  used_count INTEGER DEFAULT 0 CHECK (used_count >= 0),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT valid_usage CHECK (max_uses = -1 OR used_count <= max_uses)
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public validate active coupons" ON public.coupons FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active_exp ON public.coupons(is_active, expires_at);

-- ── 4. ORDERS ──
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  shipping INTEGER DEFAULT 0 CHECK (shipping >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address JSONB NOT NULL,
  payment_method TEXT DEFAULT 'whatsapp' CHECK (payment_method IN ('whatsapp', 'upi', 'cod', 'card')),
  status TEXT DEFAULT 'placed' CHECK (status IN ('placed','confirmed','packed','shipped','delivered','cancelled','returned')),
  tracking_number TEXT,
  coupon_code TEXT,
  discount INTEGER DEFAULT 0 CHECK (discount >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- No public policies for orders (Admin/Service Role only)

CREATE INDEX IF NOT EXISTS idx_orders_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- ── 5. TESTIMONIALS ──
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  location TEXT NOT NULL,
  product TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(is_active);

-- ── 6. LOOKBOOK ──
CREATE TABLE IF NOT EXISTS public.lookbook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  sub TEXT,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  span TEXT DEFAULT 'single' CHECK (span IN ('single', 'double', 'full')),
  aspect TEXT DEFAULT 'square' CHECK (aspect IN ('square', 'portrait', 'landscape', 'video')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.lookbook ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read lookbook" ON public.lookbook FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_lookbook_order ON public.lookbook(sort_order);

-- ── 7. TRIGGERS ──
DO $$ 
DECLARE
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('products', 'orders', 'coupons', 'testimonials', 'lookbook')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS tr_update_updated_at ON public.%I', t);
        EXECUTE format('CREATE TRIGGER tr_update_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t);
    END LOOP;
END $$;
