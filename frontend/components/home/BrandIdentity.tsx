'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function BrandIdentity() {
  return (
    <section className="py-24 bg-[var(--offwhite)] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-0 items-stretch">

          {/* Image block */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] md:aspect-auto overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
              alt="Brand Identity"
              fill
              className="object-cover hover:scale-[1.04] transition-transform duration-1200"
            />
            {/* Gold corner accent */}
            <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-[var(--gold)]" />
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-[var(--gold)]" />
          </motion.div>

          {/* Content block */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
            className="flex flex-col justify-center bg-[var(--beige)] px-10 md:px-16 py-16 md:py-20"
          >
            <div className="section-label">Our Story</div>

            {/* FOG-style oversized blockquote */}
            <blockquote className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal leading-[1.1] text-[var(--text)] my-6">
              dustnrare is built for<br/>
              those who don't follow{' '}
              <em className="italic text-[var(--gold)]">noise.</em>
            </blockquote>

            {/* Thin rule */}
            <div className="w-12 h-px bg-[var(--gold)] mb-6" />

            <p className="text-[0.68rem] leading-[2] text-[var(--mid)] mb-3">
              We create original fits and curate rare surplus pieces. Not mass-produced,
              not trend-chasing — just carefully designed clothing for people who value
              how they move through the world.
            </p>
            <p className="text-[0.68rem] leading-[2] text-[var(--mid)] mb-10">
              Every piece is a quiet statement. Designed in New Delhi, worn everywhere.
              When a drop is gone, it stays gone.
            </p>

            <div className="mb-10">
              <Link href="/about" className="btn-outline">Read Our Story</Link>
            </div>

            {/* Stats — FOG style bold numbers */}
            <div className="flex gap-10 pt-8 border-t border-[var(--border)]">
              {[
                { num: '100%', label: 'Natural Fabrics' },
                { num: '01',   label: 'Drop per Season' },
                { num: '∞',    label: 'Wearable Life'   },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-serif text-[2.2rem] text-[var(--gold)] leading-none mb-1 font-normal">{s.num}</div>
                  <div className="text-[0.45rem] tracking-[0.3em] uppercase text-[var(--mid)] font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
