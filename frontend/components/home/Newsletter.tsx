"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setDone(true);
    toast.success("You're on the rare list! ✦");
    setLoading(false);
  }

  return (
    <section className="relative py-28 bg-[var(--beige)] overflow-hidden">
      {/* Decorative text — fixed: much smaller, lower opacity, pushed to bottom */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none select-none overflow-hidden leading-none"
      >
        <span className="font-serif text-[12vw] font-bold text-[var(--text)] opacity-[0.04] whitespace-nowrap translate-y-1/3">
          RARE
        </span>
      </div>

      <div className="relative z-10 max-w-[720px] mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          {/* Editorial tag */}
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-[var(--gold)] block" />
            <span className="text-[0.45rem] tracking-[0.55em] uppercase text-[var(--gold)] font-semibold">
              Early Access
            </span>
            <span className="w-8 h-px bg-[var(--gold)] block" />
          </div>

          <h2 className="font-serif text-[clamp(2.4rem,5vw,4rem)] font-normal text-[var(--text)] leading-[1.0] mb-4">
            Get <em className="italic text-[var(--gold)]">Rare</em> First
          </h2>

          <p className="text-[0.55rem] tracking-[0.28em] uppercase text-[var(--mid)] mb-10">
            Drop alerts · Editorials · Exclusive early access
          </p>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8"
            >
              <div className="font-serif text-4xl text-[var(--gold)] mb-3">
                ✦
              </div>
              <p className="text-[var(--mid)] text-[0.65rem] tracking-[0.3em] uppercase font-semibold">
                You're on the list
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex border border-[var(--border)] max-w-sm mx-auto focus-within:border-[var(--gold)] transition-colors duration-300"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-5 py-4 text-[0.65rem] text-[var(--text)] placeholder:text-[var(--light)] outline-none font-sans"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 bg-[var(--text)] text-[var(--offwhite)] text-[0.5rem] tracking-[0.3em] uppercase font-semibold hover:bg-[var(--gold)] transition-colors duration-300 disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? "..." : "Join"}
              </button>
            </form>
          )}

          <p className="text-[0.45rem] tracking-[0.3em] uppercase text-[var(--light)] mt-5">
            Get updates of latest products.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
