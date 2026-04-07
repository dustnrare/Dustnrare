'use client'

import { motion } from 'framer-motion'

const REVIEWS = [
  {
    stars: 5,
    text: '"The oversized jacket is unreal. Got so many compliments and nobody could guess where it was from — that\'s the whole point."',
    author: 'Aryan K.',
    location: 'New Delhi',
    product: 'Void Oversized Jacket',
  },
  {
    stars: 5,
    text: '"The quality is better than anything I\'ve found at Zara or H&M at this price. The fabric actually feels premium. Will be buying every drop."',
    author: 'Priya M.',
    location: 'Mumbai',
    product: 'Sand Washed Tunic',
  },
  {
    stars: 5,
    text: '"I love that pieces are limited. When my drop arrived I felt like I\'d gotten something genuinely rare. That feeling is hard to find."',
    author: 'Siddharth V.',
    location: 'Bangalore',
    product: 'Rare Cocoon Coat',
  },
]

export default function Reviews() {
  return (
    <section className="py-24 bg-[var(--offwhite)]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-14"
        >
          <div>
            <div className="section-label">Real People</div>
            <h2 className="section-title">What They <em className="italic text-[var(--gold)]">Say</em></h2>
          </div>
          <div className="hidden md:block font-serif text-[6rem] leading-none text-[var(--beige)] select-none">"</div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--border)]">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-[var(--offwhite)] p-8 md:p-10 group hover:bg-[var(--beige)] transition-colors duration-500"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(r.stars)].map((_, j) => (
                  <span key={j} className="text-[var(--gold)] text-xs">★</span>
                ))}
              </div>

              <p className="font-serif text-[0.95rem] text-[var(--mid)] leading-[1.9] italic mb-8">
                {r.text}
              </p>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[0.55rem] font-semibold text-[var(--text)] tracking-[0.15em] uppercase">— {r.author}</div>
                  <div className="text-[0.45rem] tracking-[0.3em] uppercase text-[var(--light)] mt-0.5">{r.location}</div>
                </div>
                <div className="text-[0.42rem] tracking-[0.3em] uppercase text-[var(--gold)] font-semibold text-right max-w-[100px] leading-loose">{r.product}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between mt-14 pt-8 border-t border-[var(--border)] gap-4"
        >
          <p className="text-[0.5rem] tracking-[0.3em] uppercase text-[var(--light)]">
            Tag us in your fits · Share your look
          </p>
          <a
            href="https://www.instagram.com/dustnrare.in"
            target="_blank" rel="noreferrer"
            className="group inline-flex items-center gap-3 text-[0.52rem] tracking-[0.3em] uppercase font-semibold text-[var(--text)] hover:text-[var(--gold)] transition-colors duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @dustnrare.in
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
