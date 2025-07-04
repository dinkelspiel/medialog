import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { dashboardRouter } from './routers/dashboard';
import { settingsRouter } from './routers/settings';
import { githubRouter } from './routers/github';
import { userEntryRouter } from './routers/userEntry';
import { listRouter } from './routers/list';
import { entriesRouter } from './routers/entries';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dashboard: dashboardRouter,
  settings: settingsRouter,
  github: githubRouter,
  userEntry: userEntryRouter,
  list: listRouter,
  entries: entriesRouter,
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
