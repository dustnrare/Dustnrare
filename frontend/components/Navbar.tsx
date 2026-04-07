"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, openCart } = useCartStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/shop", label: "Shop" },
    { href: "/lookbook", label: "Lookbook" },
    { href: "/about", label: "About" },
  ];

  // We toggle colors based on whether we have scrolled past the hero section,
  // or if we are not on the homepage (where background might be light).
  const isSolid = !isHome || scrolled;

  const navClass = isSolid
    ? "px-6 md:px-12 py-4 bg-[var(--offwhite)]/80 backdrop-blur-md border-b border-[var(--border)] text-[var(--text)]"
    : "px-6 md:px-12 py-7 bg-transparent text-white";

  const linkLineClass = isSolid ? "bg-[var(--text)]" : "bg-white";

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-700 ${navClass}`}>
        
        {/* Logo */}
        <Link href="/" className="relative group">
          <span className="font-serif text-[1.4rem] md:text-2xl tracking-[0.25em] md:tracking-[0.3em] uppercase transition-all duration-300 group-hover:text-[var(--gold)]">
             DUST<span className="text-[var(--gold)] mx-0.5">·</span>N
             <span className="text-[var(--gold)] mx-0.5">·</span>RARE
          </span>
          <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-500 group-hover:w-full ${linkLineClass}`} />
        </Link>

        {/* Center Links (Desktop only) */}
        <ul className="hidden md:flex gap-10 list-none items-center absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`relative group text-[0.55rem] tracking-[0.25em] uppercase font-semibold transition-colors duration-300 ${isSolid ? "hover:text-[var(--gold)]" : "hover:text-white/70"}`}
              >
                {l.label}
                <span className={`absolute -bottom-2 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${linkLineClass}`} />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center transition-opacity hover:opacity-70"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          <button
            onClick={openCart}
            className={`text-[0.45rem] md:text-[0.5rem] tracking-[0.25em] uppercase px-3 py-2 md:px-4 md:py-2.5 font-semibold border transition-all duration-300 ${
              isSolid 
                ? "border-[var(--text)] hover:bg-[var(--text)] hover:text-white" 
                : "border-white hover:bg-white hover:text-black"
            }`}
          >
            Bag ({count()})
          </button>

          <button
            className="md:hidden flex flex-col items-center justify-center gap-[5px] w-8 h-8 relative"
            onClick={() => setMobileOpen(true)}
          >
            <span className={`block w-6 h-[1.5px] transition-all duration-300 ${isSolid ? "bg-[var(--text)]" : "bg-white"}`} />
            <span className={`block w-6 h-[1.5px] transition-all duration-300 w-[18px] ml-auto ${isSolid ? "bg-[var(--text)]" : "bg-white"}`} />
            <span className={`block w-6 h-[1.5px] transition-all duration-300 ${isSolid ? "bg-[var(--text)]" : "bg-white"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
            className="fixed inset-0 z-[60] bg-[var(--offwhite)] flex flex-col justify-center px-10"
          >
            {/* Close Button */}
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute top-8 right-6 text-[0.5rem] tracking-[0.3em] uppercase text-[var(--text)] hover:text-[var(--gold)] transition-colors inline-block p-2"
            >
              Close ✕
            </button>

            {/* Menu Links */}
            <div className="flex flex-col gap-4 text-center">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, ease: [0.23, 1, 0.32, 1], duration: 0.8 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-serif text-[3.8rem] leading-[1.1] text-[var(--text)] hover:text-[var(--gold)] transition-colors duration-300 block italic"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom Controls / Search */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-12 flex flex-col items-center gap-4"
            >
              <div className="w-full h-px bg-[var(--border)] mb-4" />
              <button
                onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
                className="text-[0.6rem] tracking-[0.3em] uppercase font-medium text-[var(--mid)] flex items-center gap-3"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Search Products
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
