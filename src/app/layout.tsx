import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

// 1. Expand metadata for comprehensive SEO and social sharing
export const metadata: Metadata = {
  title: 'PostureGuard - AI Ergonomics Monitor',
  description: 'Maintain perfect posture and boost productivity with real-time AI tracking.',
  keywords: ['posture', 'ergonomics', 'AI tracking', 'health', 'productivity'],
  authors: [{ name: 'PostureGuard Team' }],
  openGraph: {
    title: 'PostureGuard - AI Ergonomics',
    description: 'Maintain perfect posture and boost productivity with AI.',
    url: 'https://postureguard.app',
    siteName: 'PostureGuard',
    images: [
      {
        url: '/og-image.png', // Assumes you place an og-image.png in the /public folder
        width: 1200,
        height: 630,
        alt: 'PostureGuard Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PostureGuard - AI Ergonomics',
    description: 'Maintain perfect posture and boost productivity with AI.',
    creator: '@postureguard',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Add suppressHydrationWarning to prevent extension/theme mismatch errors
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
