import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// 1. Configure the font with subsets and a CSS variable
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PostureGuard - AI Ergonomics',
  description: 'Maintain perfect posture and boost productivity with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. Apply the font variable globally to the body */}
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
