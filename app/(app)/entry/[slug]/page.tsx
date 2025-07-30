import EntryServer from '@/components/islands/entry/server';
import HeaderLayout from '@/components/layouts/header';
import prisma from '@/server/db';
import React from 'react';
import { ProfileHeader } from '../../users/[username]/_components/header';
import { Header } from '@/components/header';
import { SidebarButtons } from '../../_components/sidebar';
import {
  getDefaultWhereForTranslations,
  getUserTitleFromEntry,
} from '@/server/api/routers/dashboard_';
import { validateSessionToken } from '@/server/auth/validateSession';

export const dynamic = 'force-dynamic';

const Page = async ({
  params: _params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await _params;
  const authUser = await validateSessionToken();

  if (!authUser) {
    const entry = await prisma.entry.findFirst({
      where: {
        slug: params.slug,
      },
      include: {
        translations: {
          where: {
            language: {
              iso_639_1: 'en',
            },
          },
        },
      },
    });

    if (!entry) return;

    return <EntryServer entryId={entry.id} />;
  }

  const entry = await prisma.entry.findFirst({
    where: {
      slug: params.slug,
    },
    include: {
      translations: getDefaultWhereForTranslations(authUser),
    },
  });

  if (!entry) return 'No entry with slug';

  return (
    <HeaderLayout className="gap-0">
      <Header
        titleComponent={getUserTitleFromEntry(entry)}
        sidebarContent={<SidebarButtons />}
      ></Header>
      <EntryServer entryId={entry.id} />
    </HeaderLayout>
  );
};

export default Page;
