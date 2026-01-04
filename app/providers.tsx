// In Next.js, this file would be called: app/providers.jsx
"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { TRPCReactProvider } from '@/trpc/react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </QueryClientProvider>
  );
}
