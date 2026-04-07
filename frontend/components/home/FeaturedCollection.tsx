'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { productsApi } from '@/lib/api'
import { Product } from '@/store'

type Gender = 'men' | 'women' | 'surplus'

const TABS: { id: Gender; label: string }[] = [
  { id: 'men',     label: 'Men'     },
  { id: 'women',   label: 'Women'   },
  { id: 'surplus', label: 'Surplus' },
]

export default function FeaturedCollection() {
  const [gender,   setGender]   = useState<Gender>('men')
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    productsApi.getAll({ category: gender, limit: 4 })
      .then(data => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [gender])

  return (
    <section className="py-24 bg-[var(--offwhite)]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
          >
            <div className="section-label">SS '25 Drop</div>
            <h2 className="section-title">
              Featured <em className="italic text-[var(--gold)]">Collection</em>
            </h2>
          </motion.div>

          {/* Tabs — minimal underline style */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex gap-0 border border-[var(--border)]"
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setGender(tab.id)}
                className={`relative px-8 py-3 text-[0.52rem] tracking-[0.3em] uppercase font-semibold transition-all duration-400 ${
                  gender === tab.id
                    ? 'bg-[var(--text)] text-[var(--offwhite)]'
                    : 'bg-transparent text-[var(--light)] hover:text-[var(--mid)] hover:bg-[var(--beige)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Products */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[var(--beige)] animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              key={gender}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 0.07} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="flex justify-between items-center mt-12 pt-8 border-t border-[var(--border)]"
        >
          <span className="text-[0.5rem] tracking-[0.3em] uppercase text-[var(--light)]">
            {gender === 'surplus' ? 'Limited stock — once gone, stays gone' : `Showing ${gender}'s edit`}
          </span>
          <Link
            href={`/shop?gender=${gender}`}
            className="group flex items-center gap-2 text-[0.52rem] tracking-[0.25em] uppercase font-semibold text-[var(--text)] hover:text-[var(--gold)] transition-colors duration-300"
          >
            View All
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
