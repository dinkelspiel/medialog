import '@/styles/globals.css';
import '@/styles/themes.css';
import { TRPCReactProvider } from '@/trpc/react';
import { Metadata, Viewport } from 'next';
import { ThemeProvider } from './_components/ThemeContext';
import { getTheme } from './_components/theme';
import Providers from './providers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();

  return (
    <TRPCReactProvider>
      <ThemeProvider theme={theme}>
        <Providers>{children}</Providers>
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
