// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from './components/Header';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Currency Converter - Real-time Exchange Rates',
  description: 'Convert currencies with real-time exchange rates. Support for 50+ currencies, historical charts, and favorite pairs.',
  keywords: 'currency converter, exchange rates, forex, currency exchange, real-time rates',
  authors: [{ name: 'Your Name' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Currency Converter - Real-time Exchange Rates',
    description: 'Convert currencies with real-time exchange rates and historical data',
    type: 'website',
    siteName: 'Currency Converter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Currency Converter - Real-time Exchange Rates',
    description: 'Convert currencies with real-time exchange rates and historical data',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
