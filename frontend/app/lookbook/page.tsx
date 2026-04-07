import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Lookbook — DUST·N·RARE',
  description: 'SS \'25 Editorial — Shot in New Delhi.',
}

const LOOKS = [
  {
    id: 1, title: 'Look 01 — The Wanderer',
    sub: 'Void Jacket + Ash Trouser',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80',
    span: 'lg:col-span-2 lg:row-span-2',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 2, title: 'Look 02 — Stillness',
    sub: 'Sand Tunic + Raw Trouser',
    img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=700&q=80',
    span: '',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 3, title: 'Look 03 — The Rare One',
    sub: 'Cocoon Coat — Solo',
    img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&q=80',
    span: '',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 4, title: 'Look 04 — Dusk',
    sub: 'Full Collection Styling',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80',
    span: 'lg:col-span-2',
    aspect: 'aspect-[16/9]',
  },
  {
    id: 5, title: 'Look 05 — Grain & Light',
    sub: 'Dust Linen Shirt',
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=80',
    span: '',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 6, title: 'Look 06 — Archive',
    sub: 'Worn Denim — Surplus Edit',
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=80',
    span: '',
    aspect: 'aspect-[3/4]',
  },
]

export default function LookbookPage() {
  return (
    <>
      {/* HERO */}
      <section className="pt-32 pb-12 px-8 bg-[var(--text)] text-center">
        <div className="section-label justify-center" style={{ color: 'rgba(184,150,90,0.7)' }}>
          SS '25 Editorial
        </div>
        <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] font-normal text-white leading-[0.95] mt-2 mb-4">
          The <em className="italic text-[var(--gold)]">Lookbook</em>
        </h1>
        <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/40">
          Shot in New Delhi · Spring–Summer 2025
        </p>
      </section>

      {/* EDITORIAL NOTE */}
      <div className="bg-[var(--beige)] px-8 py-10 text-center border-b border-[var(--border)]">
        <p className="font-serif text-lg md:text-2xl text-[var(--text)] max-w-[600px] mx-auto leading-relaxed italic">
          "Six looks. One city. Clothing that doesn't ask to be noticed — but always is."
        </p>
        <p className="text-[0.52rem] tracking-widest uppercase text-[var(--mid)] mt-4">Creative Direction — Dust N Rare Studio</p>
      </div>

      {/* LOOKBOOK GRID */}
      <section className="bg-[var(--offwhite)] py-12 px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {LOOKS.map((look) => (
            <div
              key={look.id}
              className={`group relative overflow-hidden bg-[var(--beige)] ${look.span}`}
            >
              <div className={`${look.aspect} w-full`}>
                <Image
                  src={look.img}
                  alt={look.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>

              {/* Caption overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--text)]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                  <p className="font-serif text-lg text-white leading-tight">{look.title}</p>
                  <p className="text-[0.5rem] tracking-widest uppercase text-[var(--gold)] mt-1">{look.sub}</p>
                </div>
              </div>

              {/* Always visible number */}
              <div className="absolute top-4 left-4 text-[0.48rem] tracking-widest uppercase text-white/60 bg-black/20 px-2 py-1">
                {String(look.id).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEHIND THE SCENES STRIP */}
      <section className="py-16 px-8 bg-[var(--lavender)]">
        <div className="max-w-[1280px] mx-auto">
          <div className="section-label mb-2">Behind The Drop</div>
          <h2 className="font-serif text-3xl font-normal text-[var(--text)] mb-10">
            How <em className="italic text-[#6b5a8a]">SS '25</em> was made
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Concept',   icon: '◌', text: 'Every collection starts with a feeling, not a trend. SS \'25 was built around the idea of clothing that breathes — lightweight, unhurried, real.' },
              { title: 'Sourcing',  icon: '⟡', text: 'We spent three months sourcing fabrics. Deadstock linen from Surat. Surplus denim from Bangalore. Premium 240 GSM cotton from Tirupur.' },
              { title: 'Shooting',  icon: '◈', text: 'Shot over two days in South Delhi. Natural light only. No studio, no backdrop. We wanted the pieces to live in a real environment.' },
            ].map(s => (
              <div key={s.title} className="bg-[var(--offwhite)] p-7">
                <div className="text-xl text-[var(--gold)] mb-3">{s.icon}</div>
                <h3 className="font-serif text-xl text-[var(--text)] mb-3">{s.title}</h3>
                <p className="text-[0.64rem] leading-loose text-[var(--mid)]">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP CTA */}
      <section className="py-20 px-8 bg-[var(--text)] text-center">
        <div className="section-label justify-center" style={{ color: 'rgba(184,150,90,0.6)' }}>Shop The Look</div>
        <h2 className="font-serif text-4xl font-normal text-white mt-2 mb-4">
          Wear what you've <em className="italic text-[var(--gold)]">seen.</em>
        </h2>
        <p className="text-[0.62rem] tracking-[0.2em] text-white/40 uppercase mb-8">
          All pieces from this editorial are available now
        </p>
        <Link href="/shop" className="btn-gold inline-block">
          Shop SS '25 →
        </Link>
      </section>

      <Footer />
    </>
  )
}
