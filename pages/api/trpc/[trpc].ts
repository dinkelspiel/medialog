import type { NextApiRequest, NextApiResponse } from 'next';
import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return createNextApiHandler({
    router: appRouter,
    createContext: () => {
      const headersInit: HeadersInit = Object.entries(req.headers || {}).reduce<
        Record<string, string>
      >((acc, [k, v]) => {
        if (typeof v === 'string') acc[k] = v;
        else if (Array.isArray(v)) acc[k] = v.join(',');
        return acc;
      }, {});

      return createTRPCContext({ headers: new Headers(headersInit), res });
    },
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
          }
        : undefined,
  })(req, res);
}
