import { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import BaseLayout from '@/components/layouts/base';
import Providers from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout>
      <Providers>{children}</Providers>
    </BaseLayout>
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
