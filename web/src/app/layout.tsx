import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TokenScope | Cryptocurrency Analytics Dashboard',
  description: 'Advanced cryptocurrency analytics dashboard with real-time data, technical indicators, and portfolio insights. Built with Next.js and powered by CoinGecko API.',
  keywords: ['cryptocurrency', 'analytics', 'bitcoin', 'ethereum', 'trading', 'dashboard', 'data analytics'],
  authors: [{ name: 'TokenScope' }],
  openGraph: {
    title: 'TokenScope | Cryptocurrency Analytics Dashboard',
    description: 'Advanced cryptocurrency analytics with real-time data and technical indicators',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
