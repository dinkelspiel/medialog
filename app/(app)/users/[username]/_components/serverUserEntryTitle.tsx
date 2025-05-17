import { getUserTitleFromEntryId } from '@/server/api/routers/dashboard';

export const ServerEntryTitleForUser = async ({
  entryId,
}: {
  entryId: number;
}) => {
  const title = await getUserTitleFromEntryId(entryId);
  return title;
};
