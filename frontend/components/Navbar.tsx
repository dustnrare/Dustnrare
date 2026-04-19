"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const { count, openCart } = useCartStore();

  const handleMenuSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (menuSearch.trim()) {
      router.push(`/shop?q=${encodeURIComponent(menuSearch.trim())}`);
      setMobileOpen(false);
      setMenuSearch("");
    }
  };

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
    { href: "/shop?category=men", label: "Men" },
    { href: "/shop?category=women", label: "Women" },
  ];

  const isSolid = !isHome || scrolled;

  const navClass = isSolid
    ? "px-6 md:px-12 py-3 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[var(--border)] text-[var(--text)]"
    : "px-6 md:px-12 py-5 bg-transparent text-white";

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-700 ${navClass}`}>

        {/* Left Controls: Hamburger + Search */}
        <div className="flex items-center gap-5 w-[30%]">
          <button
            className="flex flex-col items-center justify-center gap-[5px] w-8 h-8 relative group"
            onClick={() => setMobileOpen(true)}
          >
            <span className="block w-6 h-[1.5px] transition-all duration-300 bg-current" />
            <span className="block w-[18px] h-[1.5px] transition-all duration-300 bg-current group-hover:w-6" />
            <span className="block w-6 h-[1.5px] transition-all duration-300 bg-current" />
          </button>

          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center transition-opacity hover:opacity-70"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        {/* Center Logo */}
        <div className="w-[40%] flex justify-center">
          <Link href="/" className="relative group flex items-center gap-3">
            {/* <Image
              src="/whitelogo.png"
              alt="Dust N Rare"
              width={36}
              height={36}
              className="w-8 h-8 md:w-9 md:h-9 object-contain transition-transform duration-500 group-hover:scale-105"
              style={{ filter: isSolid ? 'invert(1)' : 'invert(1)' }}
            /> */}
            <span className="font-serif text-[1.1rem] md:text-[1.3rem] tracking-[0.2em] uppercase transition-all duration-300 group-hover:text-[var(--gold)]">
              DUST<span className="text-[var(--gold)] mx-0.5">·</span>N
              <span className="text-[var(--gold)] mx-0.5">·</span>RARE
            </span>
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-end gap-6 w-[30%]">
          <a href="tel:+918789277058" className="hidden md:block text-[0.55rem] tracking-[0.25em] uppercase hover:text-[var(--gold)] transition-colors duration-300">
            Call Us
          </a>
          <button
            onClick={openCart}
            className="relative flex items-center justify-center group"
            aria-label="View Cart"
          >
            <svg 
              width="22" height="22" viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="1.5" 
              className="text-current group-hover:text-[var(--gold)] transition-colors duration-300"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {mounted && count() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--gold)] text-[var(--bg)] text-[0.55rem] font-bold flex items-center justify-center rounded-full leading-none">
                {count()}
              </span>
            )}
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
            className="fixed inset-0 z-[60] bg-[var(--bg)] flex flex-col justify-center px-10"
          >
            {/* Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-8 right-6 text-[0.5rem] tracking-[0.3em] uppercase text-[var(--text-soft)] hover:text-[var(--gold)] transition-colors inline-block p-2"
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
              className="mt-16 w-full max-w-md mx-auto"
            >
              <form onSubmit={handleMenuSearch} className="relative group">
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Find your piece..."
                  className="w-full bg-transparent border-b border-[var(--border)] py-4 px-2 text-[0.85rem] tracking-[0.2em] font-light uppercase outline-none focus:border-[var(--gold)] transition-all duration-500 placeholder:text-[var(--text-muted)] text-[var(--text)]"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--gold)] transition-colors p-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </form>
              <div className="flex justify-center mt-6">
                <p className="text-[0.45rem] tracking-[0.4em] uppercase text-[var(--text-muted)] opacity-40 italic">
                  Premium Rare Surplus
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
