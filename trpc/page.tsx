// 'use client';

// import HeaderLayout from '@/components/layouts/header';
// import React, { useEffect, useRef, useState } from 'react';
// import { SidebarButtons } from '../../_components/sidebar';
// import { Header } from '@/components/header';
// import { FilterView } from '../../dashboard/_components/FilterView';
// import { api } from '@/trpc/react';
// import Activity from '@/components/activity';
// import StyleHeader from '@/components/styleHeader';
// import { cn } from '@/lib/utils';
// import UserEntryCard from '@/components/userEntryCard';
// import { EntryRedirect } from '../../_components/EntryIslandContext';
// import { Badge } from '@/components/ui/badge';
// import { Loader2 } from 'lucide-react';
// import InLibrary from '@/components/inLibrary';
// import {
//   Category,
//   Entry,
//   EntryTranslation,
//   User,
//   UserActivity,
//   UserEntry,
//   UserEntryStatus,
//   UserEntryVisibility,
// } from '@prisma/client';
// import { SafeUser } from '@/server/auth/validateSession';

// const Page = () => {
//   const feed = api.community.getFeed.useInfiniteQuery(
//     {
//       cursor: null,
//     },
//     {
//       getNextPageParam: lastPage => lastPage.nextCursor,
//     }
//   );

//   const trending = api.community.getTrending.useQuery();

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >=
//         document.body.offsetHeight - 600
//       ) {
//         if (feed.hasNextPage && !feed.isFetchingNextPage) {
//           feed.fetchNextPage();
//         }
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [feed]);

//   return (
//     <HeaderLayout>
//       <Header titleComponent="Community" sidebarContent={<></>}></Header>
//       <div className="mx-auto flex w-fit flex-col-reverse gap-16 lg:grid min-[1330px]:grid-cols-[1fr,250px]">
//         <div className="mx-auto flex flex-col gap-6 px-4 md:w-[710px]">
//           <StyleHeader>Feed</StyleHeader>
//           <div className="flex flex-col gap-3 pb-6">
//             {feed.data?.pages.map(page =>
//               page.activity.map(
//                 (
//                   activity: UserActivity & {
//                     entry: Entry & { translations: EntryTranslation[] };
//                     user: NonNullable<SafeUser>;
//                   }
//                 ) => (
//                   <Activity
//                     key={activity.id}
//                     activity={activity}
//                     title={
//                       activity.entry.translations[0]?.name ||
//                       activity.entry.originalTitle
//                     }
//                     username={activity.user.username}
//                   />
//                 )
//               )
//             )}
//             {feed.isFetchingNextPage && (
//               <div className="flex items-center justify-center gap-3 py-12">
//                 <Loader2 className="size-4 animate-spin" />
//                 Loading new entries...
//               </div>
//             )}
//             {!feed.hasNextPage && feed.data && (
//               <div className="relative py-12">
//                 <div className="h-[1px] w-full bg-base-200"></div>
//                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-100 px-4 text-center font-semibold">
//                   You have reached the end.
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <div
//           className={cn(
//             'flex flex-col gap-6 px-4 lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] lg:px-0'
//           )}
//         >
//           <div className="flex flex-col gap-4">
//             <div className="flex justify-between border-b border-b-base-200 pb-2 font-dm-serif text-3xl font-semibold">
//               Trending
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-3 lg:grid lg:grid-cols-2">
//             {trending.isLoading && (
//               <div className="flex items-center justify-center gap-3">
//                 <Loader2 className="size-4 animate-spin" /> Loading...
//               </div>
//             )}
//             {/* {trending.data && trending.data.length === 0 && (
//               <div className="flex items-center justify-center gap-3">
//                 No entries are trending right now.
//               </div>
//             )} */}
//             {trending.data?.map(entry => (
//               <EntryRedirect
//                 key={entry.entry.id}
//                 className="hover:no-underline"
//                 entryId={entry.entry.id}
//                 entrySlug={entry.entry.slug}
//               >
//                 <UserEntryCard
//                   key={`${entry.entry.id}`}
//                   {...{
//                     entryTitle:
//                       entry.entry.translations[0]?.name ||
//                       entry.entry.originalTitle,
//                     rating: entry.averageRating ?? 0,
//                     backgroundImage: entry.entry.posterPath,
//                     releaseDate: entry.entry.releaseDate,
//                     category: entry.entry.category,
//                     topRight: entry.hasUserEntry && <InLibrary />,
//                     className: 'max-w-[164px]',
//                   }}
//                 />
//               </EntryRedirect>
//             ))}
//           </div>
//         </div>
//       </div>
//     </HeaderLayout>
//   );
// };

// export default Page;
