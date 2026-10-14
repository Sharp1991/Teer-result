import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const siteUrl = 'https://www.shillongteerresults.co.in'
const GA_ID = 'G-WNCJ4YL3J0'

const siteDescription =
  'Teer Khobor: Check today’s Shillong Teer results, First Round and Second Round numbers, previous results, Shillong Teer statistics and result updates.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Teer Khobor | Shillong Teer Results Today',
    template: '%s | Teer Khobor',
  },
  description: siteDescription,
  applicationName: 'Teer Khobor',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      bn: '/bn',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'Teer Khobor | Shillong Teer Results Today',
    description: siteDescription,
    url: siteUrl,
    siteName: 'Teer Khobor',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </html>
  )
}
