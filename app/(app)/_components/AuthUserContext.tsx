'use client';

import { createContext, useContext } from 'react';

type AuthUser = { id: number; username: string; email: string };

const AuthUserContext = createContext<AuthUser | null>(null);

export function AuthUserProvider({
  user,
  children,
}: {
  user: AuthUser | null;
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
