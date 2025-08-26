import {
  getDefaultWhereForTranslations,
  getUserTitleFromEntry,
} from '@/server/api/routers/dashboard_';
import prisma from '@/server/db';
import slug from 'slug';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const entries = await prisma.entry.findMany({
    include: {
      translations: {
        where: {
          language: {
            iso_639_1: 'en',
          },
        },
      },
    },
  });

  for (const entry of entries) {
    logger.info('wads');
    const entrySlug = slug(
      `${entry.category.toLowerCase()}-${getUserTitleFromEntry(entry)}`
    );
    const entriesMatchingSlug = await prisma.entry.findMany({
      where: {
        slug: entrySlug,
      },
    });

    await prisma.entry.update({
      where: {
        id: entry.id,
      },
      data: {
        slug:
          entriesMatchingSlug.length === 0
            ? entrySlug
            : // Add one so if one already exists the new one becomes -2
              `${entrySlug}-${entriesMatchingSlug.length + 1}`,
      },
    });
  }
};
