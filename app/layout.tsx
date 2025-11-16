import './globals.css'

export const metadata = {
  title: 'Teer Results',
  description: 'Latest Teer results from various regions',
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
