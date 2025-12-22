import { Entry, EntryTranslation, User } from '@/prisma/generated/client';

export const getUserTitleFromEntry = (
  entry: Entry & { translations: EntryTranslation[] }
) => {
  return entry.translations.length !== 0
    ? entry.translations[0]!.name
    : entry.originalTitle;
};

export const getDefaultWhereForTranslations = (
  authUser: { showMediaMetaInId: number | null } | null
) => {
  return {
    where: {
      language: {
        id: authUser?.showMediaMetaInId ?? undefined,
        iso_639_1: !authUser || !authUser?.showMediaMetaInId ? 'en' : undefined,
      },
    },
  };
};
