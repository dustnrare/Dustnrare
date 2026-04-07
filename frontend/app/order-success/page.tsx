'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

function OrderSuccessContent() {
  const params  = useSearchParams()
  const orderId = params.get('id')

  return (
    <div className="min-h-screen bg-[var(--beige)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center max-w-[480px]"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 border border-[var(--gold)] rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <span className="text-[var(--gold)] text-2xl">✦</span>
        </motion.div>

        <div className="section-label justify-center mb-3">Order Confirmed</div>

        <h1 className="font-serif text-4xl md:text-5xl font-normal text-[var(--text)] leading-tight mb-4">
          Thank you for<br />choosing <em className="italic text-[var(--gold)]">Rare.</em>
        </h1>

        <p className="text-[0.65rem] leading-loose text-[var(--mid)] mb-2">
          Your order has been placed successfully.
        </p>

        {orderId && (
          <p className="text-[0.55rem] tracking-widest uppercase text-[var(--gold)] mb-8">
            Order ID: {orderId}
          </p>
        )}

        <p className="text-[0.62rem] leading-loose text-[var(--mid)] mb-10">
          We&apos;ll send you a confirmation and tracking update via WhatsApp / email once your order is packed. Most orders ship within 2–4 business days.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>

        {/* Delivery note */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: '◈', label: 'Quality Checked', sub: 'Before dispatch' },
              { icon: '⟡', label: '2–4 Days',        sub: 'Standard delivery' },
              { icon: '◎', label: '7-Day Returns',   sub: 'Easy & free' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-[var(--gold)] text-lg mb-1">{s.icon}</div>
                <div className="text-[0.52rem] font-medium text-[var(--text)] tracking-wide">{s.label}</div>
                <div className="text-[0.48rem] text-[var(--light)] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--beige)] flex items-center justify-center">
        <div className="text-[var(--gold)] text-[0.6rem] tracking-widest uppercase">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
