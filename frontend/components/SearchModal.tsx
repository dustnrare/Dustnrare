'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { productsApi } from '@/lib/api'
import { Product } from '@/store'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<Product[]>([])
  const [loading, setLoading]   = useState(false)
  const inputRef                = useRef<HTMLInputElement>(null)
  const debounceRef             = useRef<NodeJS.Timeout>()

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
    else { setQuery(''); setResults([]) }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function handleInput(val: string) {
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await productsApi.search(val)
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 left-0 right-0 z-[301] bg-[var(--offwhite)] border-b border-[var(--border)] shadow-lg"
          >
            {/* Search input */}
            <div className="flex items-center gap-4 px-8 py-5 border-b border-[var(--border)]">
              <span className="text-[var(--gold)] text-lg">⟡</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => handleInput(e.target.value)}
                placeholder="Search pieces, fabrics, styles..."
                className="flex-1 bg-transparent outline-none font-serif text-xl text-[var(--text)] placeholder:text-[var(--light)]"
              />
              {loading && (
                <div className="w-5 h-5 border border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
              )}
              <button
                onClick={onClose}
                className="text-[0.55rem] tracking-widest uppercase text-[var(--mid)] hover:text-[var(--text)] transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[70vh] overflow-y-auto">
              {query && !loading && results.length === 0 && (
                <div className="px-8 py-10 text-center">
                  <p className="font-serif text-xl text-[var(--text)] mb-2">Nothing found for &quot;{query}&quot;</p>
                  <p className="text-[0.6rem] tracking-widest uppercase text-[var(--mid)]">Try a different search term</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="px-8 py-4">
                  <p className="text-[0.5rem] tracking-widest uppercase text-[var(--light)] mb-4">
                    {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.map(product => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.id}`}
                        onClick={onClose}
                        className="group"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-[var(--beige)] mb-2">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={200} height={280}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <p className="font-serif text-[0.9rem] text-[var(--text)] leading-tight">{product.name}</p>
                        <p className="text-[0.55rem] text-[var(--mid)] mt-0.5">₹{product.price.toLocaleString()}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links when no query */}
              {!query && (
                <div className="px-8 py-6">
                  <p className="text-[0.5rem] tracking-widest uppercase text-[var(--light)] mb-4">Browse</p>
                  <div className="flex flex-wrap gap-3">
                    {['Men', 'Women', 'Surplus', 'New Drop', 'Oversized', 'Linen'].map(tag => (
                      <Link
                        key={tag}
                        href={`/shop?q=${tag.toLowerCase()}`}
                        onClick={onClose}
                        className="border border-[var(--border)] px-4 py-2 text-[0.55rem] tracking-widest uppercase text-[var(--mid)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
