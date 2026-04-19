"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      {/* Background Image with slow zoom */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Image
          src="/bghero.png"
          alt="Luxury Fashion"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Gold accent line — top */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 1.5, ease: [0.77, 0, 0.18, 1] }}
        className="absolute top-0 center-0 right-0 h-[1px] gold-shimmer origin-center z-20"
      />

      {/* Top-right editorial label */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute top-12 right-12 z-10 text-right hidden lg:block"
      >
        <div className="text-[0.45rem] tracking-[0.55em] uppercase text-white/40 mb-1">
          India
        </div>
        <div className="text-[0.45rem] tracking-[0.55em] uppercase text-[var(--gold)]/60">
          Est. 2026
        </div>
      </motion.div> */}

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 pb-16 md:pb-24 max-w-[1600px] mx-auto items-start text-left">

        {/* Season tag */}
        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="px-4 py-1.5 border border-[var(--gold)]/30 text-[var(--gold)] text-[0.45rem] md:text-[0.5rem] tracking-[0.4em] uppercase mb-6 md:mb-8 w-fit backdrop-blur-sm"
        >
          SS '26 Collection
        </motion.div> */}

        {/* Oversized headline */}
        <div className="overflow-hidden w-full">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.77, 0, 0.18, 1] }}
            className="font-serif text-[2.8rem] xs:text-[3.5rem] sm:text-[6rem] md:text-[clamp(6rem,11vw,10rem)] leading-[0.9] tracking-[-0.03em] font-normal pb-2 md:pb-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.3)]"
          >
            Quiet
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8 md:mb-12 w-full">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 0.75, ease: [0.77, 0, 0.18, 1] }}
            className="font-serif text-[2.8rem] xs:text-[3.5rem] sm:text-[6rem] md:text-[clamp(6rem,11vw,10rem)] leading-[0.9] tracking-[-0.03em] font-normal italic pb-2 md:pb-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.3)]"
          >
            <span className="gold-shimmer-text">Luxury.</span>
          </motion.h1>
        </div>

        {/* Sub-line + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-14"
        >
          <p className="text-[0.55rem] md:text-[0.65rem] tracking-[0.25em] md:tracking-[0.3em] uppercase text-white/70 max-w-[220px] md:max-w-[280px] leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
            Original fits. Rare surplus. Limited always.
          </p>

          <div className="flex gap-6 sm:gap-8 mt-2 md:mt-0">
            <Link
              href="/shop?gender=men"
              className="group flex flex-col gap-1 items-start"
            >
              <span className="text-[0.55rem] md:text-[0.6rem] tracking-[0.25em] uppercase font-medium text-white hover:text-[var(--gold)] transition-colors duration-500">
                Shop Men
              </span>
              <span className="w-6 h-px bg-[var(--gold)]/40 group-hover:w-full group-hover:bg-[var(--gold)] transition-all duration-500" />
            </Link>

            <Link
              href="/shop?gender=women"
              className="group flex flex-col gap-1 items-start"
            >
              <span className="text-[0.55rem] md:text-[0.6rem] tracking-[0.25em] uppercase font-medium text-white hover:text-[var(--gold)] transition-colors duration-500">
                Shop Women
              </span>
              <span className="w-6 h-px bg-[var(--gold)]/40 group-hover:w-full group-hover:bg-[var(--gold)] transition-all duration-500" />
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 right-6 md:bottom-10 md:right-12 hidden md:flex flex-col items-center gap-3"
        >
          {/* <div className="w-[1px] h-12 md:h-16 bg-[var(--gold)]/10 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-[var(--gold)]"
              animate={{
                height: ["0%", "100%", "0%"],
                top: ["0%", "0%", "100%"],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div> */}
          {/* <span className="text-[0.4rem] tracking-[0.4em] uppercase text-[var(--gold)]/30 writing-mode-vertical rotate-180">
            Scroll
          </span> */}
        </motion.div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />
    </section>
  );
}
