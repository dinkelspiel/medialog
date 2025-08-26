import prisma from '@/server/db';
import logger from '@/server/logger';
import {
  addMeilisearchEntryByEntryId,
  createIndexes,
  deleteAllDocuments,
} from '@/server/meilisearch';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  logger.info('Start');
  const entries = await prisma.entry.findMany();

  logger.info('Indexes');
  await createIndexes();
  logger.info('Delete...');
  await deleteAllDocuments();

  for (const entry of entries) {
    logger.info(entry.id);
    await addMeilisearchEntryByEntryId(entry.id);
  }
};
