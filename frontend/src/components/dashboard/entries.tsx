import React from "react";
import AddMedia from "../addMedia";
import UserEntryData from "@/interfaces/userEntryData";
import { UserEntry } from "@/interfaces/userEntry";
import Entry from "../entry";
import { Skeleton } from "../ui/skeleton";
import { AspectRatio } from "../ui/aspect-ratio";
import { useUserContext } from "@/app/app/user-provider";
import { toast } from "sonner";
import { SortByType } from "@/interfaces/sortByType";
import { useMediaQuery } from "usehooks-ts";

interface EntriesProps {
  fetchEntries: (
    userId: number,
    timeout?: NodeJS.Timeout | undefined,
  ) => Promise<void>;
  pendingUserEntries: boolean;
  userEntries: UserEntry[];
  sortBy: SortByType;
  getUserEntryData: (
    userEntryId: number,
    updateExisting?: boolean,
  ) => Promise<void>;
}

const Entries = ({
  fetchEntries,
  pendingUserEntries,
  userEntries,
  sortBy,
  getUserEntryData,
}: EntriesProps) => {
  const { user } = useUserContext();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (user === undefined) return;

  return (
    <>
      <AddMedia
        {...{
          fetchEntries: () => {
            fetchEntries(user.id).catch((e: string) => toast.error(e));
          },
          userId: user.id,
        }}
      />
      {!pendingUserEntries
        ? userEntries
            .sort((a, b) => {
              switch (sortBy) {
                case "rating":
                  return b.rating - a.rating;
                case "az":
                  return a.franchiseName.localeCompare(b.franchiseName);
                case "watched":
                  if (a.watchedAt === undefined || b.watchedAt === undefined) {
                    return 0;
                  }
                  return (
                    new Date(b.watchedAt).getTime() -
                    new Date(a.watchedAt).getTime()
                  );
                case "updated":
                  return (
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                  );
              }
            })
            .map((userEntry: UserEntry) => {
              return (
                <Entry
                  key={userEntry.id}
                  id={userEntry.id}
                  title={
                    userEntry.entries > 1
                      ? `${userEntry.franchiseName}: ${userEntry.entryName}`
                      : userEntry.franchiseName
                  }
                  releaseYear={2023}
                  rating={userEntry.rating}
                  coverUrl={userEntry.coverUrl}
                  onClick={() => {
                    getUserEntryData(userEntry.id).catch((e: string) => {
                      toast.error(e);
                    });
                  }}
                />
              );
            })
        : isDesktop
          ? [...(Array(2) as number[])].map((_, i) => (
              <Skeleton
                key={`desk${i}`}
                className="relative h-[255px] w-[170px] cursor-pointer"
              />
            ))
          : [...(Array(2) as number[])].map((_, i) => (
              <Skeleton key={`mob${i}`}>
                <AspectRatio
                  ratio={2 / 3}
                  className="cursor-pointer"
                ></AspectRatio>
              </Skeleton>
            ))}
    </>
  );
};

export default Entries;
