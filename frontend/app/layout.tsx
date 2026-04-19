import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Cursor from '@/components/Cursor'
import ConditionalNavbar from '@/components/ConditionalNavbar'

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export const metadata: Metadata = {
  title: {
    default: 'DUST·N·RARE — Premium Streetwear | Quiet Luxury Fashion India',
    template: '%s | DUST·N·RARE',
  },
  description: 'Premium streetwear brand crafting original designs and curated rare surplus pieces. Quiet luxury, limited drops. Based in India. Not for everyone.',
  keywords: ['streetwear', 'luxury fashion', 'premium clothing India', 'limited drops', 'rare fashion', 'dustnrare', 'quiet luxury', 'designer streetwear', 'oversized fashion'],
  authors: [{ name: 'Dust N Rare' }],
  creator: 'Dust N Rare',
  publisher: 'Dust N Rare',
  icons: {
    icon: '/whitelogo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'DUST·N·RARE — Premium Streetwear',
    description: 'Crafted Rare. Worn Bold. Original fits and rare surplus pieces.',
    url: 'https://dustnrare.netlify.app',
    siteName: 'Dust N Rare',
    images: [{ url: '/whitelogo.png', width: 1200, height: 630, alt: 'Dust N Rare - Premium Streetwear' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DUST·N·RARE — Premium Streetwear',
    description: 'Crafted Rare. Worn Bold. Original fits and rare surplus pieces.',
    images: ['/whitelogo.png'],
  },
  metadataBase: new URL('https://dustnrare.netlify.app'),
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Dust N Rare',
              url: 'https://dustnrare.netlify.app',
              logo: 'https://dustnrare.netlify.app/whitelogo.png',
              description: 'Premium streetwear brand. Quiet luxury, limited drops.',
              sameAs: [
                'https://www.instagram.com/dustnrare.in',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-8789277058',
                contactType: 'customer service',
              },
            }),
          }}
        />
      </head>
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
        <ConditionalNavbar />
        <main>{children}</main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#F5F0E8',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              borderLeft: '3px solid #C9A84C',
              borderRadius: '0',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            },
          }}
        />
      </body>
    </html>
  )
}
