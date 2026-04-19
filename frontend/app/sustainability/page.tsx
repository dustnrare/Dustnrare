import { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Sustainability — DUST·N·RARE',
  description: 'Our commitment to ethical sourcing and sustainable streetwear.',
}

export default function SustainabilityPage() {
  return (
    <>
      <section className="pt-32 pb-16 px-8 bg-[var(--beige)]">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="section-label">Our Philosophy</div>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-[var(--text)] mt-4">
            <em className="italic text-[var(--gold)]">Crafted</em> Conciously
          </h1>
          <p className="text-[0.7rem] leading-loose text-[var(--mid)] mt-8 max-w-[500px] mx-auto">
            True luxury doesn&apos;t cost the earth. We believe in creating pieces that last, using materials that matter. Our approach to streetwear focuses on quality over quantity, upcycling over discarding.
          </p>
        </div>
      </section>

      <section className="py-24 px-8 bg-[var(--offwhite)]">
        <div className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <div className="text-3xl text-[var(--gold)] mb-6">⟡</div>
            <h2 className="font-serif text-3xl mb-4">Original & Surplus</h2>
            <p className="text-[0.7rem] leading-loose text-[var(--mid)]">
              Our model relies on two pillars: crafting high-quality original designs in small batches to avoid overproduction, and sourcing premium deadstock surplus garments that would otherwise go to waste. 
            </p>
          </div>
          <div className="aspect-[4/5] bg-[var(--border)] w-full">
            {/* Image Placeholder */}
            <div className="w-full h-full bg-black/5" />
          </div>

          <div className="aspect-[4/5] bg-[var(--border)] w-full hidden md:block">
            {/* Image Placeholder */}
            <div className="w-full h-full bg-black/5" />
          </div>
          <div>
            <div className="text-3xl text-[var(--gold)] mb-6">◈</div>
            <h2 className="font-serif text-3xl mb-4">Slow Release</h2>
            <p className="text-[0.7rem] leading-loose text-[var(--mid)]">
              We don&apos;t follow seasons or trend cycles. Our drops happen when the product is ready. This allows us to perfect the fit, test the materials, and ensure every piece earns its place in your wardrobe.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
