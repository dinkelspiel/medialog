import '@/styles/globals.css';
import '@/styles/themes.css';
import { TRPCReactProvider } from '@/trpc/react';
import { Metadata, Viewport } from 'next';
import Providers from './providers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <Providers>{children}</Providers>
    </TRPCReactProvider>
  );
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Medialog',
};
