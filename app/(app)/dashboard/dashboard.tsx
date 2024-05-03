'use client';

import React from 'react';

import {
  Header,
  HeaderContent,
  HeaderDescription,
  HeaderHeader,
  HeaderTitle,
} from '@/components/header';
import UserEntryComponent from './userEntry';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Entry, User, UserEntry } from '@prisma/client';
import { AArrowDown, Eye, Pen, Star } from 'lucide-react';

const Dashboard = ({
  userEntries,
}: {
  userEntries: (UserEntry & { entry: Entry } & { user: User })[];
}) => {
  return (
    <>
      <Header>
        <HeaderHeader>
          <HeaderTitle>My Media</HeaderTitle>
          <HeaderDescription>
            Search through your entire media catalogue
          </HeaderDescription>
        </HeaderHeader>
        <HeaderContent>
          <Tabs value="rating">
            <TabsList>
              <TabsTrigger value={'rating'}>
                <Star className="size-3" />
                Rating
              </TabsTrigger>
              <TabsTrigger value={'az'}>
                <AArrowDown className="size-3" />
                A-Z
              </TabsTrigger>
              <TabsTrigger value={'watched'}>
                <Eye className="size-3" />
                Watched
              </TabsTrigger>
              <TabsTrigger value={'updated'}>
                <Pen className="size-3" />
                Updated
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </HeaderContent>
      </Header>
      <div className="grid justify-center">
        <div className="grid grid-cols-3 min-[800px]:grid-cols-4 min-[1100px]:grid-cols-5 min-[1300px]:grid-cols-6 min-[1500px]:grid-cols-7 w-fit gap-4">
          {userEntries
            .sort((a, b) => b.rating - a.rating)
            .map(userEntry => (
              <UserEntryComponent userEntry={userEntry} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
