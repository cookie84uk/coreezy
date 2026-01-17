import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Coreezy | Stake. Vibe. Grow.',
    template: '%s | Coreezy',
  },
  description:
    'A community hub built on Coreum. Enterprise-grade validation infrastructure with community-aligned incentives. Stake COREUM, vibe with COREZ, grow together.',
  keywords: [
    'Coreum',
    'COREZ',
    'staking',
    'validator',
    'crypto',
    'blockchain',
    'DeFi',
    'NFT',
  ],
  authors: [{ name: 'Coreezy Vibes LLC' }],
  creator: 'Coreezy Vibes LLC',
  publisher: 'Coreezy Vibes LLC',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://coreezy.xyz'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://coreezy.xyz',
    siteName: 'Coreezy',
    title: 'Coreezy | Stake. Vibe. Grow.',
    description:
      'A community hub built on Coreum. Enterprise-grade validation infrastructure with community-aligned incentives.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Coreezy - Built on Coreum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coreezy | Stake. Vibe. Grow.',
    description:
      'A community hub built on Coreum. Enterprise-grade validation infrastructure with community-aligned incentives.',
    images: ['/og-image.png'],
    creator: '@CoreezyVibes',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-coreezy-950 text-coreezy-50 antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
