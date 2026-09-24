import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://www.shillongteerresults.co.in'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Shillong Teer Results Today | First & Second Round',
    template: '%s | Shillong Teer Results',
  },
  description:
    'Check today’s Shillong Teer results, First Round and Second Round numbers, previous results, and Teer statistics.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Shillong Teer Results Today',
    description:
      'Check today’s Shillong Teer First Round and Second Round results, previous results, and statistics.',
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
    </html>
  )
}
