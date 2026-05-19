import type { Metadata } from 'next';
import './globals.css';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';
import ScrollColorManager from '@/components/layout/ScrollColorManager';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Pedro · Creative Developer',
  description: 'Portfolio inmersivo de Pedro — Senior Creative Developer especializado en React, Next.js, Three.js e integraciones IA.',
  keywords: ['portfolio', 'developer', 'React', 'Next.js', 'Three.js', 'creative developer'],
  authors: [{ name: 'Pedro' }],
  openGraph: {
    title: 'Pedro · Creative Developer',
    description: 'Arquitecto de experiencias digitales — de ideas a productos reales.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <SmoothScrollProvider>
          <ScrollColorManager />
          <Navbar />
          <main>{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
