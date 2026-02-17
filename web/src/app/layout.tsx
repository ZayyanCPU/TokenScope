import type { Metadata, Viewport } from 'next'
import { Manrope, Playfair_Display } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TokenScope | Binance-Style Crypto Analytics',
    template: '%s | TokenScope',
  },
  description: 'Binance-style cryptocurrency analytics dashboard with real-time data, technical indicators, and exportable feature engineering outputs.',
  applicationName: 'TokenScope',
  keywords: ['cryptocurrency', 'analytics', 'bitcoin', 'ethereum', 'trading', 'dashboard', 'data analytics'],
  authors: [{ name: 'TokenScope' }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'TokenScope | Binance-Style Crypto Analytics',
    description: 'Advanced cryptocurrency analytics with real-time data, technical indicators, and feature engineering.',
    type: 'website',
    url: '/',
  },
}

export const viewport: Viewport = {
  themeColor: '#0b0e11',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${playfair.variable} bg-dark-500 text-gray-100 antialiased`}>{children}</body>
    </html>
  )
}
