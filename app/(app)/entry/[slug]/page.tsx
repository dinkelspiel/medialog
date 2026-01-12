import EntryServer from '@/components/islands/entry/server';
import HeaderLayout from '@/components/layouts/header';
import prisma from '@/server/db';
import React from 'react';
import { Header } from '@/components/header';
import { SidebarButtons } from '../../_components/sidebar';
import {
  getDefaultWhereForTranslations,
  getUserTitleFromEntry,
} from '@/server/api/routers/dashboard_';
import { validateSessionToken } from '@/server/auth/validateSession';
import { Entry } from '@/prisma/generated/browser';
import { EntryWithTranslation } from '@/lib/types';
import { redirect } from 'next/navigation';

const Page = async ({
  params: _params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await _params;
  const authUser = await validateSessionToken();

  return redirect("/dashboard")
  // if (!authUser) {
    
  //   const entry = await prisma.entry.findFirst({
  //     where: {
  //       slug: params.slug,
  //     },
  //     include: {
  //       translations: {
  //         where: {
  //           language: {
  //             iso_639_1: 'en',
  //           },
  //         },
  //       },
  //     },
  //   });

  //   if (!entry) return <div>No entry with slug</div>;

  //   return <EntryServer entryId={(entry as unknown as Entry).id} />;
  // }

  // const entry = await prisma.entry.findFirst({
  //   where: {
  //     slug: params.slug,
  //   },
  //   include: {
  //     translations: getDefaultWhereForTranslations(authUser),
  //   },
  // });

  // if (!entry) return 'No entry with slug';

  // return (
  //   <HeaderLayout className="gap-0">
  //     <Header
  //       titleComponent={getUserTitleFromEntry(entry as unknown as EntryWithTranslation)}
  //       sidebarContent={<SidebarButtons />}
  //     ></Header>
  //     <EntryServer entryId={(entry as unknown as EntryWithTranslation).id} />
  //   </HeaderLayout>
  // );
};

export default Page;
