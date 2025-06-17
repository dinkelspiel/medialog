import prisma from '@/server/db';
import {
  addMeilisearchEntryByEntryId,
  createIndexes,
  deleteAllDocuments,
} from '@/server/meilisearch';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  console.log('Start');
  const entries = await prisma.entry.findMany();

  console.log('Indexes');
  await createIndexes();
  console.log('Delete...');
  await deleteAllDocuments();

  for (const entry of entries) {
    console.log(entry.id);
    await addMeilisearchEntryByEntryId(entry.id);
  }
};
