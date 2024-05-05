import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import Dashboard from './client';

const Page = async () => {
  const user = await validateSessionToken();

  const userEntries = await prisma.userEntry.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      user: true,
      entry: {
        include: {
          userEntries: {
            where: {
              userId: user?.id,
            },
          },
        },
      },
    },
  });

  return <Dashboard userEntries={userEntries} />;
};

export default Page;
