"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BrandShowcase() {
  return (
    <section className="relative py-32 bg-[var(--surface)] overflow-hidden">
      {/* Decorative background text */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden leading-none"
      >
        <span className="font-serif text-[12vw] font-bold text-[var(--gold)] opacity-[0.03] whitespace-nowrap translate-y-1/3">
          DUST
        </span>
      </div>

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />

      <div className="relative z-10 max-w-[800px] mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-10 flex justify-center"
          >
            <Image
              src="/whitelogo.png"
              alt="Dust N Rare"
              width={60}
              height={60}
              className="opacity-20"
              style={{ filter: 'invert(1)' }}
            />
          </motion.div>

          {/* Tagline */}
          <div className="inline-flex items-center gap-4 mb-10">
            <span className="w-8 h-px bg-[var(--gold)] block" />
            <span className="text-[0.45rem] tracking-[0.6em] uppercase text-[var(--gold)] font-semibold">
              The Archive
            </span>
            <span className="w-8 h-px bg-[var(--gold)] block" />
          </div>

          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal text-[var(--text)] leading-[1.0] mb-6">
            A visual diary of <em className="italic text-[var(--gold)]">Quiet Luxury</em>
          </h2>

          <p className="text-[0.6rem] leading-relaxed tracking-widest uppercase text-[var(--text-muted)] mb-12 max-w-[500px] mx-auto">
            Explore the intersection of raw textures and refined tailoring.
            Follow our journey and discover editorial features.
          </p>

          <a
            href="https://instagram.com/dustnrare.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-5 bg-[var(--gold)] text-[var(--bg)] text-[0.55rem] tracking-[0.3em] uppercase font-semibold hover:bg-[var(--gold-light)] transition-all duration-500 gold-glow-hover relative overflow-hidden"
          >
            <span className="relative z-10">Follow our Journey</span>
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />
    </section>
  );
}
