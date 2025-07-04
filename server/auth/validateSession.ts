import { cookies } from 'next/headers';
import prisma from '../db';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export type SafeUser = Awaited<ReturnType<typeof validateSessionToken>>;

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
    select: safeUserSelect(),
  });
});

export const safeUserSelect = () => ({
  id: true,
  username: true,
  email: true,
  ratingStyle: true,
  theme: true,
  showMediaMetaIn: true,
  showMediaMetaInId: true,

  dailyStreakLength: true,
  dailyStreakLongest: true,
  dailyStreakStarted: true,
  dailyStreakUpdated: true,

  invitedBy: true,
  invitedById: true,

  createdAt: true,
});
