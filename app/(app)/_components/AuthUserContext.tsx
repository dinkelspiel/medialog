'use client';

import { User } from '@prisma/client';
import { createContext, useContext } from 'react';

type AuthUser = { id: number; username: string };

const AuthUserContext = createContext<AuthUser | null>(null);

export function AuthUserProvider({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  return (
    <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
  );
}

export function useAuthUser() {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error('useAuthUser must be used within a AuthUserProvider');
  }
  return context;
}
