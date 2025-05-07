import { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import BaseLayout from '@/components/layouts/base';
import Providers from './providers';
import { TRPCReactProvider } from '@/trpc/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <BaseLayout>
        <Providers>{children}</Providers>
      </BaseLayout>
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
