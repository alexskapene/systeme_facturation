import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppProviders from '@/AppProviders/AppProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'eTax Solution RDC',
  description: 'Système de facturation électronique sécurisé en RDC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr" // Changé en "fr" pour le contexte RDC
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="h-full antialiased bg-slate-50 text-slate-900">
        {/* On enveloppe toute l'application avec les Providers Redux et Auth */}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
