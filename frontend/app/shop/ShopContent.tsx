'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { productsApi } from '@/lib/api'
import { Product } from '@/store'

const CATEGORIES = ['men', 'women', 'surplus']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const FITS = ['oversized', 'regular', 'slim']

export default function ShopContent() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    const [cats, setCats] = useState<string[]>(() => {
        const g = searchParams.get('gender')
        return g ? [g] : []
    })
    const [sizes, setSizes] = useState<string[]>([])
    const [fits, setFits] = useState<string[]>([])
    const [maxPrice, setMaxPrice] = useState(10000)
    const [sort, setSort] = useState('featured')

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const query = searchParams.get('q')
            let data: Product[] = []

            if (query) {
                data = await productsApi.search(query)
            } else {
                const params: Record<string, any> = {}
                if (cats.length) params.category = cats.join(',')
                if (fits.length) params.fit = fits.join(',')
                if (maxPrice < 10000) params.maxPrice = maxPrice
                if (sort !== 'featured') params.sort = sort

                data = await productsApi.getAll(params)
            }
            setProducts(data)
        } catch {
            setProducts([])
        } finally {
            setLoading(false)
        }
    }, [cats, fits, maxPrice, sort, searchParams])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    function toggle<T>(arr: T[], item: T, setter: (v: T[]) => void) {
        setter(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])
    }

    function resetFilters() {
        setCats([])
        setSizes([])
        setFits([])
        setMaxPrice(10000)
        setSort('featured')
    }

    return (
        <>
            <div className="pt-28 pb-10 bg-[var(--bg-elevated)] text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="section-label justify-center"
                >
                    SS &apos;26 Collection
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-serif text-[clamp(2.5rem,6vw,5rem)] text-[var(--text)]"
                >
                    {searchParams.get('q') ? (
                        <>Results for <em className="text-[var(--gold)]">&quot;{searchParams.get('q')}&quot;</em></>
                    ) : (
                        <>The <em className="text-[var(--gold)]">Collection</em></>
                    )}
                </motion.h1>
            </div>

            <div className="max-w-[1280px] mx-auto px-6 py-10 flex gap-8 bg-[var(--bg)] min-h-screen">
                {/* Sidebar */}
                <aside className="w-56 hidden md:block flex-shrink-0">
                    <div className="sticky top-24 space-y-8">
                        <button 
                            onClick={resetFilters}
                            className="text-[0.5rem] tracking-[0.25em] uppercase text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors border-b border-[var(--border)] pb-2 w-full text-left"
                        >
                            ↻ Reset Filters
                        </button>

                        {/* Category */}
                        <div>
                            <p className="text-[0.5rem] tracking-[0.3em] uppercase text-[var(--gold)] font-semibold mb-3">Category</p>
                            {CATEGORIES.map(c => (
                                <label key={c} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                                    <div className={`w-4 h-4 border flex items-center justify-center transition-all ${cats.includes(c) ? 'border-[var(--gold)] bg-[var(--gold)]' : 'border-[var(--border)] group-hover:border-[var(--gold)]/50'}`}>
                                        {cats.includes(c) && <span className="text-[var(--bg)] text-[0.5rem]">✓</span>}
                                    </div>
                                    <span 
                                        className="text-[0.65rem] tracking-wider uppercase text-[var(--text-soft)] cursor-pointer"
                                        onClick={() => toggle(cats, c, setCats)}
                                    >{c}</span>
                                    <input
                                        type="checkbox"
                                        checked={cats.includes(c)}
                                        onChange={() => toggle(cats, c, setCats)}
                                        className="hidden"
                                    />
                                </label>
                            ))}
                        </div>

                        {/* Fit */}
                        <div>
                            <p className="text-[0.5rem] tracking-[0.3em] uppercase text-[var(--gold)] font-semibold mb-3">Fit</p>
                            {FITS.map(f => (
                                <label key={f} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                                    <div className={`w-4 h-4 border flex items-center justify-center transition-all ${fits.includes(f) ? 'border-[var(--gold)] bg-[var(--gold)]' : 'border-[var(--border)] group-hover:border-[var(--gold)]/50'}`}>
                                        {fits.includes(f) && <span className="text-[var(--bg)] text-[0.5rem]">✓</span>}
                                    </div>
                                    <span 
                                        className="text-[0.65rem] tracking-wider uppercase text-[var(--text-soft)] cursor-pointer"
                                        onClick={() => toggle(fits, f, setFits)}
                                    >{f}</span>
                                    <input
                                        type="checkbox"
                                        checked={fits.includes(f)}
                                        onChange={() => toggle(fits, f, setFits)}
                                        className="hidden"
                                    />
                                </label>
                            ))}
                        </div>

                        {/* Sort */}
                        <div>
                            <p className="text-[0.5rem] tracking-[0.3em] uppercase text-[var(--gold)] font-semibold mb-3">Sort</p>
                            <select 
                                value={sort} 
                                onChange={e => setSort(e.target.value)}
                                className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-soft)] text-[0.6rem] px-3 py-2 outline-none focus:border-[var(--gold)] transition-colors"
                            >
                                <option value="featured">Featured</option>
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Products */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] bg-[var(--surface)] animate-pulse" />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="font-serif text-2xl text-[var(--text)] mb-2">No pieces found</p>
                            <p className="text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)]">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {products.map((p, i) => (
                                <ProductCard key={p.id} product={p} delay={i * 0.04} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )

}