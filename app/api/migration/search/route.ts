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

  console.log('Delete...');
  await deleteAllDocuments();
  await createIndexes();

  for (const entry of entries) {
    console.log(entry.id);
    console.log('Add Entry');
    await addMeilisearchEntryByEntryId(entry.id);
  }
};
