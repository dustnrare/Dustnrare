"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    id: "men",
    label: "Men",
    count: "12 Pieces",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  },
  {
    id: "women",
    label: "Women",
    count: "8 Pieces",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
  },
  {
    id: "surplus",
    label: "Surplus",
    count: "Limited",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80",
  },
  {
    id: "all",
    label: "New Drop",
    count: "SS '25",
    img: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-28 bg-[var(--bg)]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="section-label">Categories</div>

          <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-tight">
            Shop <span className="italic text-[var(--gold)]">Essentials</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
            >
              <Link
                href={`/shop${cat.id !== "all" ? `?gender=${cat.id}` : ""}`}
                className="group block"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-[var(--surface)] aspect-[3/4]">
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
                </div>

                {/* Text */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-[var(--text)]">
                      {cat.label}
                    </h3>

                    <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[var(--text-muted)] mt-1">
                      {cat.count}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="text-[var(--gold)] text-sm opacity-0 group-hover:opacity-100 transition">
                    →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
