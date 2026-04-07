'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCartStore, Product } from '@/store'
import toast from 'react-hot-toast'

interface Props {
  product: Product
  delay?: number
}

export default function ProductCard({ product, delay = 0 }: Props) {
  const [hovered, setHovered]   = useState(false)
  const [imgIdx, setImgIdx]     = useState(0)
  const [selectedSize, setSz]   = useState<string | null>(null)
  const { addItem, openCart }   = useCartStore()

  const mainImg = product.images[imgIdx] || product.images[0]

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    const size = selectedSize || product.sizes[0]
    addItem(product, size, 1)
    toast.success(`${product.name} added ✦`)
    openCart()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      onMouseEnter={() => { setHovered(true); if (product.images[1]) setImgIdx(1) }}
      onMouseLeave={() => { setHovered(false); setImgIdx(0) }}
      className="group bg-[var(--offwhite)] hover:shadow-[0_20px_60px_rgba(42,38,34,0.12)] transition-all duration-600"
    >
      <Link href={`/shop/${product.id}`}>
        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden relative bg-[var(--beige)]">
          {product.badge && (
            <span className={`absolute top-3 left-3 z-10 text-[0.42rem] tracking-[0.4em] uppercase px-2.5 py-1.5 font-semibold ${
              product.badge === 'Limited' || product.badge === 'Surplus'
                ? 'bg-[var(--text)] text-[var(--offwhite)]'
                : 'bg-[var(--gold)] text-white'
            }`}>
              {product.badge}
            </span>
          )}
          {product.stock <= 4 && (
            <span className="absolute top-3 right-3 z-10 text-[0.42rem] tracking-[0.35em] uppercase px-2.5 py-1.5 border border-white/50 text-white bg-black/30 backdrop-blur-sm font-semibold">
              Only {product.stock} left
            </span>
          )}
          <Image
            src={mainImg}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ${hovered ? 'scale-108' : 'scale-100'}`}
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Quick add overlay — slides up from bottom */}
          <div className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-400 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <button
              onClick={handleQuickAdd}
              className="w-full bg-[var(--offwhite)] text-[var(--text)] text-[0.48rem] tracking-[0.35em] uppercase py-3 font-semibold hover:bg-[var(--gold)] hover:text-white transition-all duration-300"
            >
              + Quick Add
            </button>
          </div>

          {/* Size selector on hover */}
          {hovered && product.sizes.length > 0 && (
            <div className="absolute top-0 left-0 right-0 p-3 flex flex-wrap gap-1 bg-gradient-to-b from-black/30 to-transparent">
              {product.sizes.map(sz => (
                <button
                  key={sz}
                  onClick={(e) => { e.preventDefault(); setSz(sz) }}
                  className={`text-[0.4rem] tracking-widest uppercase px-2 py-1 border font-semibold transition-all ${
                    selectedSize === sz
                      ? 'border-[var(--gold)] bg-[var(--gold)] text-white'
                      : 'border-white/40 text-white hover:border-white bg-black/20'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-4 py-4">
          <p className="text-[0.42rem] tracking-[0.4em] uppercase text-[var(--gold)] mb-1.5 font-semibold">{product.category} · {product.fit}</p>
          <h3 className="font-serif text-[1.05rem] text-[var(--text)] leading-tight mb-2">{product.name}</h3>
          <div className="flex items-center gap-2.5">
            {product.original_price && (
              <span className="text-[0.62rem] text-[var(--light)] line-through">₹{product.original_price.toLocaleString()}</span>
            )}
            <span className="text-[0.75rem] text-[var(--text)] font-semibold">₹{product.price.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
