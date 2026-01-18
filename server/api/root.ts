import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { dashboardRouter } from './routers/dashboard';
import { settingsRouter } from './routers/settings';
import { githubRouter } from './routers/github';
import { userEntryRouter } from './routers/userEntry';
import { listRouter } from './routers/list';
import { entriesRouter } from './routers/entries';
import { importRouter } from './routers/import';
import { authRouter } from './routers/auth';
import { userListRouter } from './routers/userList';
import { communityRouter } from './routers/community';
import { entryRouter } from './routers/entry';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  dashboard: dashboardRouter,
  settings: settingsRouter,
  github: githubRouter,
  userEntry: userEntryRouter,
  list: listRouter,
  entries: entriesRouter,
  entry: entryRouter,
  import: importRouter,
  userList: userListRouter,
  community: communityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
