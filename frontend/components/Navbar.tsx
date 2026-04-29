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
  const [mounted, setMounted] = useState(false);
  const { count, openCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
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
        
        {/* Left Controls - Hamburger */}
        <div className="flex items-center w-[20%] md:w-1/3">
          <button
            className="flex flex-col items-start justify-center gap-[5px] w-8 h-8 relative group"
            onClick={() => setMobileOpen(true)}
          >
            <span className={`block w-6 h-[1.5px] transition-all duration-300 ${isSolid ? "bg-[var(--text)]" : "bg-white"}`} />
            <span className={`block w-4 h-[1.5px] transition-all duration-300 group-hover:w-6 ${isSolid ? "bg-[var(--text)]" : "bg-white"}`} />
            <span className={`block w-6 h-[1.5px] transition-all duration-300 ${isSolid ? "bg-[var(--text)]" : "bg-white"}`} />
          </button>
        </div>

        {/* Center Logo */}
        <div className="w-[60%] md:w-1/3 flex justify-center items-center text-center">
          <Link href="/" className="relative group inline-block">
            <span className="font-serif text-[1.4rem] md:text-2xl tracking-[0.25em] md:tracking-[0.3em] uppercase transition-all duration-300 group-hover:text-[var(--gold)]">
               DUST<span className="text-[var(--gold)] mx-0.5">·</span>N
               <span className="text-[var(--gold)] mx-0.5">·</span>RARE
            </span>
            <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-500 group-hover:w-full ${linkLineClass}`} />
          </Link>
        </div>

        {/* Right Controls - Bag */}
        <div className="flex items-center justify-end w-[20%] md:w-1/3">
          <button
            onClick={openCart}
            className={`relative flex items-center justify-center transition-opacity duration-300 hover:opacity-70 ${
              isSolid ? "text-[var(--text)]" : "text-white"
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="absolute -top-1.5 -right-2 text-[0.55rem] bg-[var(--gold)] text-white min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center font-bold">
              {mounted ? count() : 0}
            </span>
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
