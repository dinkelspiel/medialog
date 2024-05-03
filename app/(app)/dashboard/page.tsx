import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderHeader,
  HeaderTitle,
} from '@/components/header';
import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import UserEntry from './userEntry';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dashboard from './dashboard';

const Page = async () => {
  const user = await validateSessionToken();

  const userEntries = await prisma.userEntry.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      user: true,
      entry: true,
    },
  });

  return <Dashboard userEntries={userEntries} />;
};

export default Page;
