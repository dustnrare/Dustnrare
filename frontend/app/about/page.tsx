import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'The story behind Dust N Rare — an independent premium streetwear label from India. Original designs, rare surplus pieces, limited always.',
}

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="pt-28 pb-16 bg-[var(--bg-elevated)] px-8">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-16 items-end">
          <div>
            <div className="section-label">The Brand</div>
            <h1 className="font-serif text-[clamp(3rem,7vw,5.5rem)] font-normal leading-[0.95] text-[var(--text)]">
              Not{' '}
              <em className="italic text-[var(--gold)] block">Mass-<br/>Produced.</em>
              Never.
            </h1>
          </div>
          <div className="pb-2">
            <p className="text-[0.72rem] leading-[1.9] text-[var(--text-soft)] mb-4">
              dustnrare started with a simple, clear idea — to create pieces that don&apos;t feel
              like they came from a factory line, a trend forecast, or a generic algorithm.
            </p>
            <p className="text-[0.72rem] leading-[1.9] text-[var(--text-soft)]">
              We are an independent label from India. We design original pieces and
              hand-select surplus fabrics and garments that meet our standard. Everything is
              limited. Everything is intentional.
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-20 px-8 bg-[var(--bg)]">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-[1fr_2fr] gap-16 items-start">
          <div className="aspect-[3/4] overflow-hidden bg-[var(--surface)] sticky top-24">
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80"
              alt="Our Story"
              width={500} height={666}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-8 py-4">
            <blockquote className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-normal leading-[1.3] text-[var(--text)] border-l-2 border-[var(--gold)] pl-6">
              &quot;Wear what&apos;s not repeated.&quot;
            </blockquote>
            <p className="text-[0.7rem] leading-[1.9] text-[var(--text-soft)]">
              We launched in 2026 because we were tired of seeing the same fits everywhere.
              Every brand seemed to be selling the same five silhouettes with different logos.
              We wanted something different — clothing that carries personality without shouting it.
            </p>
            <p className="text-[0.7rem] leading-[1.9] text-[var(--text-soft)]">
              Our collections are split between original designs — pieces we sketch, sample, and
              produce in small batches — and surplus, which are premium fabrics and deadstock
              garments we source, rework, and re-release at honest prices.
            </p>
            <p className="text-[0.7rem] leading-[1.9] text-[var(--text-soft)]">
              Both categories share one DNA: intention. Nothing we make is accidental.
              We take our time with each piece, and we only release it when it&apos;s right.
            </p>
            <Link href="/shop" className="btn-primary w-fit">Shop The Collection</Link>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 px-8 bg-[var(--surface)]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-14">
            <div className="section-label justify-center">What We Stand For</div>
            <h2 className="section-title">Our <em className="italic text-[var(--gold)]">Values</em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '◎', title: 'Original, Always',    text: 'Every design we release is created in-house. No template. No trend-copying. We design for longevity, not seasons.' },
              { icon: '⟡', title: 'Rare By Nature',      text: "We run limited quantities per drop. When something's gone, it's gone. Rarity is not a gimmick — it's how we maintain quality." },
              { icon: '✦', title: 'Fabric First',        text: "We source natural, quality textiles — cotton, linen, surplus denim. If we wouldn't wear it ourselves, we won't sell it." },
            ].map(v => (
              <div key={v.title} className="bg-[var(--bg-elevated)] border border-[var(--border)] p-8 hover:border-[var(--gold)]/20 transition-colors duration-500">
                <div className="text-2xl text-[var(--gold)] mb-4">{v.icon}</div>
                <h3 className="font-serif text-xl text-[var(--text)] mb-3">{v.title}</h3>
                <p className="text-[0.65rem] leading-[1.8] text-[var(--text-soft)]">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-20 px-8 bg-[var(--bg)]">
        <div className="max-w-[600px] mx-auto text-center">
          <div className="section-label justify-center">Get In Touch</div>
          <h2 className="section-title mb-6">Say <em className="italic text-[var(--gold)]">Hello</em></h2>
          <p className="text-[0.68rem] leading-[1.9] text-[var(--text-soft)] mb-8">
            For orders, collaborations, press, or just to talk about fashion — we&apos;re always open.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="https://www.instagram.com/dustnrare.in" target="_blank" rel="noreferrer"
              className="btn-outline flex items-center gap-2 justify-center"
            >Instagram</a>
            <a href="mailto:dustnrare@gmail.com" className="btn-primary flex items-center gap-2 justify-center">
              Email Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
