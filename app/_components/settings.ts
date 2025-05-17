import prisma from '@/server/db';
import { Settings } from './SettingsContext';

import { validateSessionToken } from '@/server/auth/validateSession';
import { Language } from '@prisma/client';

export const getTheme = async () => {
  const user = await validateSessionToken();
  return user ? user.theme : 'neutral';
};

export const getUserShowMediaIn = async () => {
  const user = await validateSessionToken();
  let language: Language;
  if (user && user.showMediaMetaInId) {
    language = (await prisma.language.findFirst({
      where: {
        id: user.showMediaMetaInId,
      },
    }))!;
  } else {
    // Default to english
    language = (await prisma.language.findFirst({
      where: {
        iso_639_1: 'en',
      },
    }))!;
  }
  return language;
};

export const getSettings = async () => {
  return {
    theme: await getTheme(),
    showMediaMetaIn: await getUserShowMediaIn(),
  } satisfies Settings;
};
