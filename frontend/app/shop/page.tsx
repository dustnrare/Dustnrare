'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { productsApi } from '@/lib/api'
import { Product } from '@/store'

const CATEGORIES = ['men', 'women', 'surplus']
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const FITS       = ['oversized', 'regular', 'slim']

export default function ShopPage() {
  const searchParams                = useSearchParams()
  const [products, setProducts]     = useState<Product[]>([])
  const [loading, setLoading]       = useState(true)

  // Filter state
  const [cats,    setCats]    = useState<string[]>(() => {
    const g = searchParams.get('gender')
    return g ? [g] : []
  })
  const [sizes,   setSizes]   = useState<string[]>([])
  const [fits,    setFits]    = useState<string[]>([])
  const [maxPrice,setMaxPrice]= useState(10000)
  const [sort,    setSort]    = useState('featured')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, any> = {}
      if (cats.length)    params.category  = cats.join(',')
      if (fits.length)    params.fit       = fits.join(',')
      if (maxPrice < 10000) params.maxPrice = maxPrice
      if (sort !== 'featured') params.sort = sort
      const data = await productsApi.getAll(params)
      setProducts(data)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [cats, fits, maxPrice, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function toggle<T>(arr: T[], item: T, setter: (v: T[]) => void) {
    setter(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])
  }

  function resetFilters() {
    setCats([]); setSizes([]); setFits([]); setMaxPrice(10000); setSort('featured')
  }

  return (
    <>
      {/* HERO */}
      <div className="pt-28 pb-10 bg-[var(--beige)] text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="section-label justify-center"
        >SS '25 Collection</motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
          className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal text-[var(--text)]"
        >
          The <em className="text-[var(--gold)]">Collection</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}
          className="text-[0.6rem] tracking-[0.3em] uppercase text-[var(--mid)] mt-2"
        >
          Original Designs & Curated Surplus
        </motion.p>
      </div>

      {/* MAIN */}
      <div className="max-w-[1280px] mx-auto px-6 py-10 flex gap-8">

        {/* FILTER SIDEBAR */}
        <aside className="w-56 flex-shrink-0 hidden md:block sticky top-24 h-fit">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[0.52rem] tracking-[0.3em] uppercase font-semibold text-[var(--text)]">Filter</span>
            <button onClick={resetFilters} className="text-[0.48rem] tracking-widest uppercase text-[var(--gold)] hover:opacity-70 transition-opacity">
              Reset
            </button>
          </div>

          {/* Category */}
          <FilterGroup label="Category">
            {CATEGORIES.map(c => (
              <FilterCheckbox key={c} label={c} checked={cats.includes(c)} onChange={() => toggle(cats, c, setCats)} />
            ))}
          </FilterGroup>

          {/* Size */}
          <FilterGroup label="Size">
            {SIZES.map(s => (
              <FilterCheckbox key={s} label={s} checked={sizes.includes(s)} onChange={() => toggle(sizes, s, setSizes)} />
            ))}
          </FilterGroup>

          {/* Fit */}
          <FilterGroup label="Fit">
            {FITS.map(f => (
              <FilterCheckbox key={f} label={f} checked={fits.includes(f)} onChange={() => toggle(fits, f, setFits)} />
            ))}
          </FilterGroup>

          {/* Price */}
          <FilterGroup label={`Price — up to ₹${maxPrice.toLocaleString()}`}>
            <input
              type="range" min={500} max={10000} step={100} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--gold)]"
            />
          </FilterGroup>
        </aside>

        {/* GRID */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[0.58rem] tracking-widest uppercase text-[var(--mid)]">
              {loading ? 'Loading...' : `${products.length} piece${products.length !== 1 ? 's' : ''}`}
            </span>
            <select
              value={sort} onChange={e => setSort(e.target.value)}
              className="border border-[var(--border)] px-3 py-2 text-[0.6rem] text-[var(--mid)] bg-[var(--offwhite)] outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[var(--beige)] animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-[var(--text)] mb-2">No pieces found</p>
              <p className="text-[0.6rem] tracking-widest uppercase text-[var(--mid)]">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.05} />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-[0.5rem] tracking-[0.22em] uppercase text-[var(--mid)] mb-3 border-b border-[var(--border)] pb-2">{label}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-[var(--gold)]" />
      <span className={`text-[0.62rem] capitalize transition-colors ${checked ? 'text-[var(--text)] font-medium' : 'text-[var(--mid)] group-hover:text-[var(--text)]'}`}>{label}</span>
    </label>
  )
}
