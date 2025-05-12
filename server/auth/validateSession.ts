import { cookies } from 'next/headers';
import prisma from '../db';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export const validateSessionToken = cache(async () => {
  const sessionToken = cookies().get('mlSessionToken');

  if (sessionToken === null || sessionToken === undefined) {
    return null;
  }

  const session = await prisma.session.findFirst({
    where: {
      token: sessionToken.value,
    },
  });

  if (session === null) {
    return null;
  }

  if (session.expiry && session.expiry < new Date()) {
    redirect('/auth/logout');
    return null;
  }

  return await prisma.user.findFirst({
    where: {
      id: session.userId,
    },
  });
});
