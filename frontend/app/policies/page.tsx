import { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Policies — DUST·N·RARE',
  description: 'Shipping, returns and privacy policy for Dust N Rare.',
}

const POLICIES = [
  {
    id: 'shipping',
    title: 'Shipping Policy',
    icon: '⟡',
    content: [
      {
        heading: 'Delivery Timeframe',
        body: 'All orders are processed within 1–2 business days. Standard delivery across India takes 4–7 business days. Expedited shipping is not currently available, but we\'re working on it.',
      },
      {
        heading: 'Shipping Charges',
        body: 'Free shipping on all orders above ₹999. A flat fee of ₹60 applies to orders below ₹999. Shipping charges are non-refundable once an order has shipped.',
      },
      {
        heading: 'COD (Cash on Delivery)',
        body: 'COD is available across most Indian pin codes. A small COD handling fee may apply. Please ensure someone is available to receive the order at the delivery address.',
      },
      {
        heading: 'Order Tracking',
        body: 'Once your order ships, you\'ll receive a tracking number via WhatsApp or email. You can use this to track your package on the carrier\'s website.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Return & Exchange Policy',
    icon: '◎',
    content: [
      {
        heading: '7-Day Return Window',
        body: 'We accept returns within 7 days of delivery. Items must be unused, unwashed, and in their original condition with all tags intact. We do not accept returns on sale items or surplus pieces.',
      },
      {
        heading: 'How to Initiate a Return',
        body: 'DM us on Instagram (@dustnrare.in) or email hello@dustnrare.com with your order ID and reason for return. We\'ll respond within 24 hours with next steps.',
      },
      {
        heading: 'Exchanges',
        body: 'We offer size exchanges subject to availability. If your size is unavailable, we\'ll issue store credit or a full refund. Exchange shipping both ways is covered by us.',
      },
      {
        heading: 'Refunds',
        body: 'Approved refunds are processed within 5–7 business days to your original payment method. COD refunds are issued as bank transfer or store credit.',
      },
      {
        heading: 'Non-Returnable Items',
        body: 'Surplus / deadstock pieces, sale items, and any item marked "final sale" cannot be returned. Please check sizing carefully before ordering these pieces.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: '◈',
    content: [
      {
        heading: 'What We Collect',
        body: 'We collect your name, email, phone number, and delivery address when you place an order. We also collect basic usage data (pages visited, device type) to improve the website.',
      },
      {
        heading: 'How We Use Your Data',
        body: 'Your data is used only to process orders, send shipping updates, and (if you opt in) share early access to drops. We do not sell your data to any third parties.',
      },
      {
        heading: 'Payments',
        body: 'All payments are processed via Razorpay or Stripe, both of which are PCI DSS compliant. We do not store your card details on our servers.',
      },
      {
        heading: 'Cookies',
        body: 'We use essential cookies to keep your cart active across sessions. We do not use tracking cookies or third-party advertising cookies.',
      },
      {
        heading: 'Your Rights',
        body: 'You can request a copy of your data, ask us to delete your account, or opt out of marketing communications at any time by emailing hello@dustnrare.com.',
      },
    ],
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    icon: '✦',
    content: [
      {
        heading: 'General Terms',
        body: 'By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions.',
      },
      {
        heading: 'User Conduct',
        body: 'You must not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws.',
      },
      {
        heading: 'Product Availability',
        body: 'Most of our pieces are produced in small batches. We reserve the right to limit the quantities of any products or services that we offer.',
      },
      {
        heading: 'Errors & Inaccuracies',
        body: 'We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information is inaccurate at any time.',
      },
    ],
  },
]

export default function PoliciesPage() {
  return (
    <>
      {/* HERO */}
      <section className="pt-32 pb-12 px-8 bg-[var(--beige)]">
        <div className="max-w-[800px] mx-auto">
          <div className="section-label">Legal</div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-[var(--text)] mt-2">
            Our <em className="italic text-[var(--gold)]">Policies</em>
          </h1>
          <p className="text-[0.65rem] leading-loose text-[var(--mid)] mt-4 max-w-[520px]">
            We believe in total transparency. Here&apos;s everything you need to know about how we ship, handle returns, and protect your data.
          </p>
        </div>
      </section>

      {/* QUICK LINKS */}
      <div className="bg-[var(--offwhite)] border-b border-[var(--border)] sticky top-16 z-10">
        <div className="max-w-[800px] mx-auto px-8 flex gap-8">
          {POLICIES.map(p => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className="py-3 text-[0.55rem] tracking-widest uppercase text-[var(--mid)] hover:text-[var(--gold)] transition-colors border-b-2 border-transparent hover:border-[var(--gold)]"
            >
              {p.title.split(' ')[0]}
            </a>
          ))}
        </div>
      </div>

      {/* POLICY SECTIONS */}
      <div className="py-16 px-8">
        <div className="max-w-[800px] mx-auto space-y-20">
          {POLICIES.map((policy, pi) => (
            <section key={policy.id} id={policy.id}>
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl text-[var(--gold)]">{policy.icon}</span>
                <h2 className="font-serif text-3xl font-normal text-[var(--text)]">{policy.title}</h2>
              </div>
              <div className="space-y-6">
                {policy.content.map((section, si) => (
                  <div key={si} className="grid md:grid-cols-[200px_1fr] gap-4">
                    <h3 className="text-[0.55rem] tracking-widest uppercase text-[var(--gold)] pt-1 leading-relaxed">
                      {section.heading}
                    </h3>
                    <p className="text-[0.7rem] leading-loose text-[var(--mid)]">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
              {pi < POLICIES.length - 1 && (
                <div className="h-px bg-[var(--border)] mt-16" />
              )}
            </section>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <section className="py-14 px-8 bg-[var(--beige)] text-center">
        <p className="text-[0.62rem] leading-loose text-[var(--mid)] max-w-[400px] mx-auto">
          Questions about any of our policies?<br/>
          Reach us at{' '}
          <a href="mailto:hello@dustnrare.com" className="text-[var(--gold)] underline">
            hello@dustnrare.com
          </a>{' '}
          or DM{' '}
          <a href="https://www.instagram.com/dustnrare.in" target="_blank" rel="noreferrer" className="text-[var(--gold)] underline">
            @dustnrare.in
          </a>
        </p>
      </section>

      <Footer />
    </>
  )
}
