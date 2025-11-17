import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: 'Teer Results',
  description: 'Live Teer results from teertooday.com',
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
