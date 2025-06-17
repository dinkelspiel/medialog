'use client';

import { SafeUser } from '@/server/auth/validateSession';
import { createContext, useContext } from 'react';

const AuthUserContext = createContext<SafeUser | null>(null);

export function AuthUserProvider({
  user,
  children,
}: {
  user: SafeUser | null;
  children: React.ReactNode;
}) {
  return (
    <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
  );
}

export function useAuthUser() {
  const context = useContext(AuthUserContext);
  if (!context) {
    return null;
  }
  return context;
}
