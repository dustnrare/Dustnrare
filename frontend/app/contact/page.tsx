import { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Contact Us — DUST·N·RARE',
  description: 'Get in touch with the Dust N Rare team for support, styling or inquiries.',
}

export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-24 px-8 bg-[var(--beige)] min-h-[70vh] flex flex-col items-center justify-center">
        <div className="max-w-[700px] mx-auto text-center">
          <div className="section-label mb-4">Get In Touch</div>
          <h1 className="font-serif text-4xl md:text-6xl font-normal text-[var(--text)] mb-6">
            We&apos;re Here to <em className="italic text-[var(--gold)]">Help</em>
          </h1>
          <p className="text-[0.75rem] leading-loose text-[var(--mid)] mb-12 max-w-[450px] mx-auto">
            Whether you have a question about sizing, your order status, or just want to talk streetwear — drop us a line.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-[var(--offwhite)] p-8 border border-[var(--border)] hover:border-[var(--gold)] transition-colors duration-500">
              <div className="text-xl text-[var(--gold)] mb-4">✉</div>
              <h3 className="text-[0.65rem] tracking-widest uppercase font-semibold mb-2 text-[var(--text)]">Email Us</h3>
              <p className="text-[0.8rem] text-[var(--mid)] mb-4 leading-relaxed">
                For order updates, returns, and general inquiries.
              </p>
              <a href="mailto:dustnrare@gmail.com" className="text-[0.65rem] tracking-widest text-[var(--text)] border-b border-[var(--gold)] pb-1 transition-colors hover:text-[var(--gold)]">
                hello@dustnrare.com
              </a>
            </div>

            <div className="bg-[var(--offwhite)] p-8 border border-[var(--border)] hover:border-[var(--gold)] transition-colors duration-500">
              <div className="text-xl text-[var(--gold)] mb-4">◈</div>
              <h3 className="text-[0.65rem] tracking-widest uppercase font-semibold mb-2 text-[var(--text)]">Instagram</h3>
              <p className="text-[0.8rem] text-[var(--mid)] mb-4 leading-relaxed">
                For styling advice, drop updates, and quick questions.
              </p>
              <a href="https://www.instagram.com/dustnrare.in" target="_blank" rel="noreferrer" className="text-[0.65rem] tracking-widest text-[var(--text)] border-b border-[var(--gold)] pb-1 transition-colors hover:text-[var(--gold)]">
                @dustnrare.in
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
