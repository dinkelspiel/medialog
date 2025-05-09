import { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import '@/styles/themes.css';
import BaseLayout from '@/components/layouts/base';
import Providers from './providers';
import { TRPCReactProvider } from '@/trpc/react';
import { ThemeProvider } from './_components/ThemeContext';
import { getTheme } from './_components/theme';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();

  return (
    <TRPCReactProvider>
      <ThemeProvider theme={theme}>
        <BaseLayout>
          <Providers>{children}</Providers>
        </BaseLayout>
      </ThemeProvider>
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
