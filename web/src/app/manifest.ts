import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TokenScope - Binance-Style Crypto Analytics',
    short_name: 'TokenScope',
    description:
      'Binance-style cryptocurrency analytics dashboard with real-time data, technical indicators, and exportable engineered features.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0e11',
    theme_color: '#0b0e11',
    orientation: 'portrait',
    categories: ['finance', 'business', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
