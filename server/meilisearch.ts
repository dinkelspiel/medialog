import { Category, Entry } from '@prisma/client';
import { Meilisearch } from 'meilisearch';
import prisma from './db';
import { validateSessionToken } from './auth/validateSession';
import { getDefaultWhereForTranslations } from './api/routers/dashboard_';

export const meilisearchClient = new Meilisearch({
  host: process.env.MEILISEARCH_URL!,
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

export type MeilisearchEntry = {
  id: number;
  category: Category;
  releaseYear: string;
  titles: string[];
  people: string[];
  genres: string[];
  companies: string[];
};

export const MeilisearchEntriesUid = 'entries';

export const deleteAllDocuments = async () => {
  const index = meilisearchClient.index(MeilisearchEntriesUid);
  await index.deleteAllDocuments();
};

export const createIndexes = async () => {
  const task = await meilisearchClient.createIndex(MeilisearchEntriesUid);
  await meilisearchClient.tasks.waitForTask(task.taskUid);

  const index = meilisearchClient.index(MeilisearchEntriesUid);
  index.updateSearchableAttributes([
    'titles',
    'releaseYear',
    'people',
    'companies',
    'genres',
  ]);
  index.updateFilterableAttributes(['category']);
};

export const addMeilisearchEntries = async (entries: MeilisearchEntry[]) => {
  const index = meilisearchClient.index<MeilisearchEntry>(
    MeilisearchEntriesUid
  );
  await index.addDocuments(entries);
};

export const searchEntries = async (
  query: string,
  limit: number,
  categories: Category[]
) => {
  const authUser = await validateSessionToken();
  const index = meilisearchClient.index<MeilisearchEntry>(
    MeilisearchEntriesUid
  );

  const categoryFilter = categories
    .map(cat => `category = "${cat}"`)
    .join(' OR ');

  const searchEntries = await index.search(query, {
    filter: [categoryFilter],
    limit,
    showRankingScore: true,
  });
  let prismaEntries = await prisma.entry.findMany({
    where: {
      id: {
        in: searchEntries.hits.map(e => e.id),
      },
    },
    include: {
      translations: getDefaultWhereForTranslations(authUser),
      userEntries: authUser
        ? {
            where: {
              userId: authUser.id,
            },
          }
        : undefined,
    },
  });

  const prismaEntryMap = new Map(prismaEntries.map(entry => [entry.id, entry]));

  const orderedEntries = searchEntries.hits.map(hit => ({
    ...prismaEntryMap.get(hit.id)!,
    _rankingScore: hit._rankingScore ?? null,
  }));

  return orderedEntries;
};

export const addMeilisearchEntryByEntryId = async (entryId: number) => {
  const entry = await prisma.entry.findFirst({
    where: {
      id: entryId,
    },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
      productionCompanies: {
        include: {
          company: true,
        },
      },
      translations: {
        include: {
          language: true,
        },
      },
      alternativeTitles: {
        include: {
          language: true,
        },
      },
      cast: {
        include: {
          person: true,
        },
      },
      crew: {
        include: {
          person: true,
        },
      },
    },
  });

  if (!entry) {
    return;
  }

  const document: MeilisearchEntry = {
    id: entry.id,
    category: entry.category,
    releaseYear: entry.releaseDate.getUTCFullYear().toString(),
    titles: Array.from(
      new Set([
        entry.originalTitle,
        ...entry.translations.map(e => e.name),
        ...entry.alternativeTitles.map(e => e.title),
      ])
    ),
    people: Array.from(
      new Set([
        ...entry.cast.map(e => e.person.name),
        ...entry.crew.map(e => e.person.name),
      ])
    ),
    genres: Array.from(new Set([...entry.genres.map(e => e.genre.name)])),
    companies: Array.from(
      new Set([...entry.productionCompanies.map(e => e.company.name)])
    ),
  };

  await addMeilisearchEntries([document]);
};
