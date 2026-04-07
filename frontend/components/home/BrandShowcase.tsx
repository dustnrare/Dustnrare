"use client";

import { motion } from "framer-motion";

export default function BrandShowcase() {
  return (
    <section className="relative py-32 bg-[var(--beige)] overflow-hidden">
      {/* Decorative background text */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden leading-none"
      >
        <span className="font-serif text-[12vw] font-bold text-[var(--text)] opacity-[0.04] whitespace-nowrap translate-y-1/3">
          DUST
        </span>
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
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

          <p className="text-[0.6rem] leading-relaxed tracking-widest uppercase text-[var(--mid)] mb-12 max-w-[500px] mx-auto">
            Explore the intersection of raw textures and refined tailoring.
            Follow our journey and discover editorial features.
          </p>

          <a
            href="https://instagram.com/dustnrare"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-5 bg-[var(--text)] text-[var(--offwhite)] text-[0.55rem] tracking-[0.3em] uppercase font-semibold hover:bg-[var(--gold)] transition-colors duration-500"
          >
            Follow our Journey
          </a>
        </motion.div>
      </div>
    </section>
  );
}
