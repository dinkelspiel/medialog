import { Entry, EntryTranslation, User } from '@prisma/client';

export const getUserTitleFromEntry = (
  entry: Entry & { translations: EntryTranslation[] }
) => {
  const translationName = entry.translations?.[0]?.name;
  const fallbackTitle = entry.originalTitle;

  if (typeof translationName === 'string' && translationName.trim()) {
    return translationName;
  }

  return fallbackTitle;
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
