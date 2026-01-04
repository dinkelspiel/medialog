import { cookies } from 'next/headers';
import prisma from '../db';
import { cache } from 'react';
import { redirect } from 'next/navigation';

export type SafeUser = Awaited<ReturnType<typeof validateSessionToken>>;

export const validateSessionToken = cache(async () => {
  const sessionToken = (await cookies()).get('mlSessionToken');

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

// Validate a session token using the raw request headers (useful for HTTP handlers
// such as tRPC fetch adapters where next/headers cookies() isn't available).
export async function validateSessionTokenFromHeaders(
  headers?: Headers | null,
) {
  const cookieHeader = headers?.get('cookie') ?? '';
  if (!cookieHeader) return null;

  // Parse cookies from the Cookie header
  const cookiesMap: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const idx = cookie.indexOf('=');
    if (idx === -1) return;
    const name = cookie.slice(0, idx).trim();
    const val = cookie.slice(idx + 1).trim();
    cookiesMap[name] = decodeURIComponent(val);
  });

  const sessionToken = cookiesMap['mlSessionToken'];
  if (!sessionToken) return null;

  const session = await prisma.session.findFirst({
    where: {
      token: sessionToken,
    },
  });

  if (session === null) return null;
  if (session.expiry && session.expiry < new Date()) return null;

  return await prisma.user.findFirst({
    where: { id: session.userId },
    select: safeUserSelect(),
  });
}

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
