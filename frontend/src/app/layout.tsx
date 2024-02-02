import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';
import { Providers } from './providers/Providers';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { UrqlProvider } from './providers/UrqlProvider';
import { ManualGraphQLProvider } from './providers/ManualGraphQLProvider';
import GoogleAnalytics from './GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });
const TokenProvider = dynamic(() => import('./providers/TokenProvider'), { ssr: false });

const IS_INDEX_DISABLED = process.env.NEXT_PUBLIC_IS_INDEX_DISABLED;
let robots;
if (IS_INDEX_DISABLED) {
  robots = {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      //'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
} else {
  robots = {};
}

export const metadata: Metadata = {
  title: 'グチログ (日記)',
  description: 'さあ、人の目を気にせず、グチろう！',
  robots,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <head>
        <GoogleAnalytics />
        {!IS_INDEX_DISABLED && (
          <meta name="google-site-verification" content="****" />
        )}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fff" />
      </head>
      <body className={inter.className}>
        <Providers>
          <TokenProvider>
            <ManualGraphQLProvider>
              <UrqlProvider>{children}</UrqlProvider>
            </ManualGraphQLProvider>
          </TokenProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
