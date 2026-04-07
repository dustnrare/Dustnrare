import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Cursor from '@/components/Cursor'
import CartDrawer from '@/components/CartDrawer'

export const metadata: Metadata = {
  title: 'DUST·N·RARE — Quiet Luxury Streetwear',
  description: 'Original designs and curated surplus pieces. Not for everyone.',
  keywords: 'streetwear, luxury, fashion, India, minimal, rare, dustnrare',
  openGraph: {
    title: 'DUST·N·RARE',
    description: 'Crafted Rare. Worn Bold.',
    url: 'https://dustnrare.netlify.app',
    siteName: 'Dust N Rare',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="grain">
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        <Cursor />
        <Navbar />
        <CartDrawer />
        <main>{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--text)',
              color: 'var(--offwhite)',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              borderLeft: '3px solid var(--gold)',
              borderRadius: '0',
            },
          }}
        />
      </body>
    </html>
  )
}
