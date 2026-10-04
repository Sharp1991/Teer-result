import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const siteUrl = 'https://www.shillongteerresults.co.in'
const GA_ID = 'G-TW3TW1J38F'
// Google Analytics 4

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Shillong Teer Results Today | First & Second Round',
    template: '%s | Shillong Teer Results',
  },
  description:
    'Check the latest Shillong Teer result today, First Round and Second Round numbers, previous results, and Teer statistics.',
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      bn: '/bn',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'Shillong Teer Results Today',
    description:
      'Check the latest Shillong Teer result today, First Round and Second Round numbers, previous results, and Teer statistics.',
    url: siteUrl,
    siteName: 'Shillong Teer Results',
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
