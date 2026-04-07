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
            const params: Record<string, any> = {}
            if (cats.length) params.category = cats.join(',')
            if (fits.length) params.fit = fits.join(',')
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
            <div className="pt-28 pb-10 bg-[var(--beige)] text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="section-label justify-center"
                >
                    SS '25 Collection
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-serif text-[clamp(2.5rem,6vw,5rem)] text-[var(--text)]"
                >
                    The <em className="text-[var(--gold)]">Collection</em>
                </motion.h1>
            </div>

            <div className="max-w-[1280px] mx-auto px-6 py-10 flex gap-8">
                <aside className="w-56 hidden md:block">
                    <button onClick={resetFilters}>Reset</button>

                    {CATEGORIES.map(c => (
                        <div key={c}>
                            <input
                                type="checkbox"
                                checked={cats.includes(c)}
                                onChange={() => toggle(cats, c, setCats)}
                            />
                            {c}
                        </div>
                    ))}
                </aside>

                <div className="flex-1">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {products.map(p => (
                                <ProductCard key={p.id} product={p} delay={0} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )

}