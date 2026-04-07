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
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { href: "/shop", label: "Shop" },
    { href: "/lookbook", label: "Lookbook" },
    { href: "/about", label: "About" },
  ];

  const isSolid = !isHome || scrolled;

  const linkClass = isSolid
    ? "text-[var(--mid)] hover:text-[var(--text)]"
    : "text-white/80 hover:text-white";

  const iconClass = isSolid
    ? "text-[var(--mid)] hover:text-[var(--text)]"
    : "text-white/80 hover:text-white";

  const logoClass = isSolid ? "text-[var(--text)]" : "text-white";

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-700 ${
          scrolled
            ? "px-6 md:px-12 py-4 bg-[var(--offwhite)]/90 backdrop-blur-md border-b border-[var(--border)]"
            : "px-6 md:px-12 py-7 bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="relative group">
          <span
            className={`font-serif text-xl md:text-2xl tracking-[0.3em] transition-colors duration-300 group-hover:text-[var(--gold)] ${logoClass}`}
          >
            DUST<span className="text-[var(--gold)] mx-0.5">·</span>N
            <span className="text-[var(--gold)] mx-0.5">·</span>RARE
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] transition-all duration-500 group-hover:w-full" />
        </Link>

        {/* Center Links */}
        <ul className="hidden md:flex gap-10 list-none items-center absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`relative group text-[0.55rem] tracking-[0.25em] uppercase font-semibold transition-colors duration-300 ${linkClass}`}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="flex items-center gap-4 md:gap-5">
          <button
            onClick={() => setSearchOpen(true)}
            className={`hidden md:flex items-center gap-2 text-[0.52rem] tracking-[0.25em] uppercase font-semibold transition-colors duration-300 ${iconClass}`}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          <button
            onClick={openCart}
            className={`relative text-[0.5rem] tracking-[0.25em] uppercase px-4 py-2.5 font-semibold transition-all duration-300 whitespace-nowrap ${
              isSolid
                ? "bg-[var(--text)] text-[var(--offwhite)] hover:bg-[var(--gold)]"
                : "bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25"
            }`}
          >
            Bag ({count()})
          </button>

          <button
            className="md:hidden flex flex-col gap-[5px] p-1 ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span
              className={`block w-6 h-[1px] transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[6px]" : ""} ${isSolid ? "bg-[var(--text)]" : "bg-white"}`}
            />
            <span
              className={`block w-6 h-[1px] transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""} ${isSolid ? "bg-[var(--text)]" : "bg-white"}`}
            />
            <span
              className={`block w-6 h-[1px] transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""} ${isSolid ? "bg-[var(--text)]" : "bg-white"}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
            className="fixed inset-0 z-40 bg-[var(--offwhite)] flex flex-col items-center justify-center gap-2"
          >
            {links.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + i * 0.08,
                  ease: [0.23, 1, 0.32, 1],
                  duration: 0.7,
                }}
              >
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-[clamp(2.5rem,8vw,4.5rem)] text-[var(--text)] hover:text-[var(--gold)] transition-colors duration-300 block py-1 italic"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-6 mt-8"
            >
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setMobileOpen(false);
                }}
                className="text-[0.55rem] tracking-[0.3em] uppercase font-semibold text-[var(--mid)]"
              >
                Search
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
