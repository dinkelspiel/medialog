import { validateSessionToken } from '@/server/auth/validateSession';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const layout = async ({ children }: { children: ReactNode }) => {
  const user = await validateSessionToken();

  if (user !== null) {
    return redirect('/dashboard');
  }

  return children;
};

export default layout;
