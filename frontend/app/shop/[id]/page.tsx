'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store'
import { productsApi } from '@/lib/api'
import { Product } from '@/store'
import toast from 'react-hot-toast'
import Footer from '@/components/Footer'

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [mainImg, setMainImg] = useState(0)
  const [size,    setSize]    = useState<string | null>(null)
  const [qty,     setQty]     = useState(1)
  const [added,   setAdded]   = useState(false)
  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    productsApi.getOne(params.id)
      .then(data => { setProduct(data); setSize(data.sizes[0]) })
      .catch(() => toast.error('Product not found'))
  }, [params.id])

  function handleAddToCart() {
    if (!product || !size) { toast.error('Please select a size'); return }
    addItem(product, size, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    toast.success(`${product.name} added to bag ✦`)
    openCart()
  }

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-0">

          {/* GALLERY */}
          <div className="md:sticky md:top-20 md:h-[calc(100vh-80px)] overflow-y-auto p-6 flex flex-col gap-3">
            <motion.div
              className="aspect-[3/4] overflow-hidden relative bg-[var(--beige)]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <Image
                src={product.images[mainImg]}
                alt={product.name}
                fill className="object-cover"
                priority
              />
            </motion.div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(i)}
                    className={`w-16 h-20 overflow-hidden border-[1.5px] transition-all ${mainImg === i ? 'border-[var(--gold)] opacity-100' : 'border-transparent opacity-50 hover:opacity-75'}`}
                  >
                    <Image src={img} alt="" width={64} height={80} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO PANEL */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="p-8 md:p-12 flex flex-col"
          >
            <p className="text-[0.5rem] tracking-[0.3em] uppercase text-[var(--gold)] mb-2">{product.category} — {product.fit} fit</p>
            <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal text-[var(--text)] leading-tight mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl font-medium text-[var(--text)]">₹{product.price.toLocaleString()}</span>
              {product.original_price && (
                <>
                  <span className="text-[var(--light)] line-through text-sm">₹{product.original_price.toLocaleString()}</span>
                  <span className="bg-[var(--sage)] text-[var(--text)] text-[0.45rem] tracking-widest uppercase px-2 py-0.5">Sale</span>
                </>
              )}
            </div>

            {product.stock <= 4 && (
              <p className="text-[0.52rem] text-red-400 tracking-widest uppercase mb-4">⚠ Only {product.stock} left</p>
            )}

            <div className="h-px bg-[var(--border)] my-5" />

            {/* SIZE SELECTOR */}
            <p className="text-[0.52rem] tracking-[0.25em] uppercase text-[var(--mid)] mb-3">Select Size</p>
            <div className="flex gap-2 flex-wrap mb-2">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-11 h-11 border text-[0.6rem] font-medium transition-all ${
                    size === s
                      ? 'border-[var(--text)] bg-[var(--text)] text-[var(--offwhite)]'
                      : 'border-[var(--border)] text-[var(--mid)] hover:border-[var(--text)] hover:text-[var(--text)]'
                  }`}
                >{s}</button>
              ))}
            </div>
            <button className="text-[0.5rem] tracking-widest uppercase text-[var(--gold)] underline mb-5 text-left">
              Size Guide →
            </button>

            {/* QTY */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[0.52rem] tracking-[0.25em] uppercase text-[var(--mid)]">Qty</span>
              <div className="flex items-center border border-[var(--border)]">
                <button onClick={() => setQty(Math.max(1, qty-1))} className="w-9 h-9 flex items-center justify-center text-[var(--mid)] hover:bg-[var(--beige)] transition-colors">−</button>
                <span className="w-10 text-center text-[0.75rem] font-medium">{qty}</span>
                <button onClick={() => setQty(qty+1)} className="w-9 h-9 flex items-center justify-center text-[var(--mid)] hover:bg-[var(--beige)] transition-colors">+</button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-[0.62rem] tracking-[0.25em] uppercase font-medium transition-all mb-3 ${
                added
                  ? 'bg-[var(--sage)] text-[var(--text)]'
                  : 'bg-[var(--text)] text-[var(--offwhite)] hover:bg-[var(--gold)]'
              }`}
            >
              {added ? 'Added to Bag ✓' : 'Add to Bag'}
            </button>

            {/* DETAILS */}
            <div className="space-y-3 mb-6 mt-3">
              {[
                ['◈', product.fabric],
                ['⟡', 'Free shipping on orders above ₹999'],
                ['◎', 'Easy returns within 7 days'],
                ['✦', 'Pay via UPI / Bank Transfer'],
              ].map(([icon, text]) => (
                <div key={text} className="flex gap-3 py-3 border-b border-[var(--border)]">
                  <span className="text-[var(--gold)] text-sm w-5">{icon}</span>
                  <span className="text-[0.63rem] text-[var(--mid)] leading-relaxed">{text}</span>
                </div>
              ))}
            </div>

            {/* STORY */}
            <div className="bg-[var(--beige)] p-5">
              <p className="font-serif text-[1.05rem] text-[var(--text)] mb-2">About This Piece</p>
              <p className="text-[0.65rem] leading-loose text-[var(--mid)]">{product.description}</p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}
