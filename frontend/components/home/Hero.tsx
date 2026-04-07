"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Image with subtle zoom-out */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=80"
          alt="Luxury Fashion"
          className="w-full h-full object-cover opacity-75"
        />
        {/* Dark gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        {/* Subtle right vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
      </motion.div>

      {/* Top-right editorial label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute top-8 right-8 md:top-10 md:right-14 z-10 text-right hidden md:block"
      >
        <div className="text-[0.42rem] tracking-[0.55em] uppercase text-white/40 mb-1">
          New Delhi
        </div>
        <div className="text-[0.42rem] tracking-[0.55em] uppercase text-white/40">
          Est. 2025
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-16 pb-16 md:pb-20">
        {/* Season tag */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="editorial-tag text-white/50 border-white/20 mb-6 w-fit"
        >
          SS '25 Collection
        </motion.div>

        {/* Oversized headline — FOG style */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.77, 0, 0.18, 1] }}
            className="font-serif text-[clamp(3.5rem,9vw,8rem)] leading-[0.92] tracking-[-0.02em] font-normal"
          >
            Quiet
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.65, ease: [0.77, 0, 0.18, 1] }}
            className="font-serif text-[clamp(3.5rem,9vw,8rem)] leading-[0.92] tracking-[-0.02em] font-normal italic text-[var(--gold)]"
          >
            Luxury.
          </motion.h1>
        </div>

        {/* Sub-line + CTAs in flex row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12"
        >
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/50 max-w-[200px] leading-loose">
            Original fits. Rare surplus. Limited always.
          </p>

          <div className="flex gap-5">
            <Link
              href="/shop?gender=men"
              className="group flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase font-semibold text-white border-b border-white/30 pb-1 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300"
            >
              Shop Men
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/shop?gender=women"
              className="group flex items-center gap-2 text-[0.58rem] tracking-[0.3em] uppercase font-semibold text-white border-b border-white/30 pb-1 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300"
            >
              Shop Women
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 right-10 hidden md:flex flex-col items-center gap-2"
        >
          <div className="w-px h-14 bg-white/20 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-[var(--gold)]"
              animate={{
                height: ["0%", "100%", "0%"],
                top: ["0%", "0%", "100%"],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <span className="text-[0.4rem] tracking-[0.4em] uppercase text-white/30 writing-mode-vertical rotate-90 mt-1">
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}
