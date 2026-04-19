"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { productsApi } from "@/lib/api";

const INITIAL_CATEGORIES = [
  {
    id: "men",
    label: "Men",
    count: "...",
    img: "/mencategory.jpeg",
  },
  {
    id: "women",
    label: "Women",
    count: "...",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop&q=80",
  },
  {
    id: "surplus",
    label: "Surplus",
    count: "Limited",
    img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
  },
  {
    id: "all",
    label: "New Drop",
    count: "SS '26",
    img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&h=800&fit=crop&q=80",
  },
];
// 
export default function CategoryGrid() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  useEffect(() => {
    async function loadCounts() {
      try {
        const products = await productsApi.getAll();
        const menCount = products.filter(p => p.category === 'men').length;
        const womenCount = products.filter(p => p.category === 'women').length;

        setCategories(prev => prev.map(c => {
          if (c.id === 'men') return { ...c, count: `${menCount} Pieces` };
          if (c.id === 'women') return { ...c, count: `${womenCount} Pieces` };
          return c;
        }));
      } catch (err) {
        // Leave defaults if fetch fails
      }
    }
    loadCounts();
  }, []);

  return (
    <section className="py-28 bg-[var(--bg)]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="section-label">Categories</div>

          <h2 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-tight text-[var(--text)]">
            Shop <span className="italic text-[var(--gold)]">Essentials</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              viewport={{ once: true }}
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

                  {/* Dark overlay with gold border on hover */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-500" />
                  <div className="absolute inset-0 border border-transparent group-hover:border-[var(--gold)]/30 transition-all duration-500 m-3" />
                </div>

                {/* Text */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg text-[var(--text)]">
                      {cat.label}
                    </h3>

                    <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[var(--text-muted)] mt-1 transition-opacity">
                      {cat.count}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="text-[var(--gold)] text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
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
