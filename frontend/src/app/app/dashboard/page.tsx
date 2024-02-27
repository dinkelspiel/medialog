"use client";
import AddMedia from "@/components/addMedia";
import ModifyUserEntry from "@/components/dashboard/modifyUserEntry";
import Entry from "@/components/entry";
import Az from "@/components/icons/az";
import Eye from "@/components/icons/eye";
import Pen from "@/components/icons/pen";
import Sort from "@/components/icons/sort";
import Star from "@/components/icons/star";
import Xmark from "@/components/icons/xmark";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/interfaces/user";
import type UserEntryData from "@/interfaces/userEntryData";
import type UserEntryStatus from "@/interfaces/userEntryStatus";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { useUserContext } from "../user-provider";
import { useSidebarContext } from "../sidebar-provider";

interface UserEntry {
  id: number;
  franchiseName: string;
  entryName: string;
  coverUrl: string;
  entries: number;
  updatedAt: string;
  watchedAt?: string;
  rating: number;
  status: UserEntryStatus;
}

type sortByType = "rating" | "az" | "updated" | "watched";

export default function Home() {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [userEntries, setUserEntries] = useState<UserEntry[]>([]);
  const [pendingUserEntries, setPendingUserEntries] = useState(false);
  const [sortBy, setSortByValue] = useState<sortByType>("rating");
  const { user } = useUserContext();
  const { setSidebarSelected } = useSidebarContext();
  setSidebarSelected("dashboard");
  const [pendingUserEntryData, setPendingDataFetch] = useState(false);
  const [userEntryData, setUserEntryData] = useState<UserEntryData | undefined>(
    undefined,
  );
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const fetchEntries = async (
    userId: number,
    timeout: NodeJS.Timeout | undefined = undefined,
  ) => {
    if (timeout === undefined) {
      timeout = setTimeout(() => {
        setPendingUserEntries(true);
      }, 200);
    }

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/users/${userId}/entries`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    response
      .json()
      .then((data: UserEntry[]) => {
        setUserEntries(data);
        setPendingUserEntries(false);
        clearTimeout(timeout);
      })
      .catch((e: string) => toast.error(e));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPendingUserEntries(true);
    }, 200);

    if (user !== undefined) {
      fetchEntries(user.id, timeout).catch((e: string) => toast.error(e));
    }

    if (localStorage.getItem("sortBy") !== null) {
      setSortByValue(localStorage.getItem("sortBy") as sortByType);
    }
  }, [user]);

  if (user === undefined) return <div></div>;

  const setSortBy = (value: sortByType) => {
    localStorage.setItem("sortBy", value);
    setSortByValue(value);
  };

  const getUserEntryData = async (
    userEntryId: number,
    updateExisting = false,
  ) => {
    if (userEntryData !== undefined && !updateExisting) {
      if (userEntryData.id === userEntryId) {
        setUserEntryData(undefined);
        return;
      }
    }

    const timeout = setTimeout(() => {
      setPendingDataFetch(true);
    }, 200);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/users/${user.id}/entries/${userEntryId}?sessionToken=` +
        localStorage.getItem("sessionToken"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    response
      .json()
      .then((data: UserEntryData) => {
        setUserEntryData(data);
        clearTimeout(timeout);
        setPendingDataFetch(false);
      })
      .catch((e: string) => toast.error(e));
  };

  return (
    <>
      <div className="grid grid-cols-[1fr,max-content]">
        <div className="lg:scrollable-grid-item no-scrollbar flex flex-row gap-4 px-8 py-6">
          <div className="w-full">
            <div className="flex w-full flex-col gap-4  pb-4 lg:border-b lg:border-slate-200">
              <div className="flex flex-row ">
                <div className="flex w-full flex-col">
                  <div className="text-2xl font-semibold">My Media</div>
                  <div className="hidden text-sm text-slate-500 lg:block">
                    Search through your entire media catalogue
                  </div>
                </div>
                <div className="flex w-full justify-end gap-3">
                  {isDesktop ? (
                    <Tabs
                      defaultValue={localStorage.getItem("sortBy") ?? "rating"}
                    >
                      <TabsList>
                        <TabsTrigger
                          value="rating"
                          className="gap-3"
                          onClick={() => setSortBy("rating")}
                        >
                          <Star /> Rating
                        </TabsTrigger>
                        <TabsTrigger
                          value="az"
                          className="gap-3"
                          onClick={() => setSortBy("az")}
                        >
                          <Az /> A-Z
                        </TabsTrigger>
                        <TabsTrigger
                          value="watched"
                          className="gap-3"
                          onClick={() => setSortBy("watched")}
                        >
                          <Eye /> Watched
                        </TabsTrigger>
                        <TabsTrigger
                          value="updated"
                          className="gap-3"
                          onClick={() => setSortBy("updated")}
                        >
                          <Pen /> Updated
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  ) : (
                    <></>
                  )}
                  <Button
                    variant={!showFilters ? `outline` : `secondary`}
                    className="w-9 px-0"
                    onClick={() => {
                      setShowFilters((x) => !x);
                    }}
                  >
                    {!showFilters ? <Sort /> : <Xmark />}
                  </Button>
                </div>
              </div>
              {showFilters && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Title</Label>
                    <Input placeholder="Name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Directors/Writers</Label>
                      <Input placeholder="Name" />
                    </div>{" "}
                    <div className="flex flex-col gap-2">
                      <Label>Studios</Label>
                      <Input placeholder="Studio Name" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid w-[calc(100dvw-64px)] grid-cols-3 gap-4 pt-4 lg:flex lg:w-full lg:flex-row lg:flex-wrap">
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
                          if (
                            a.watchedAt === undefined ||
                            b.watchedAt === undefined
                          ) {
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
                            getUserEntryData(userEntry.id).catch(
                              (e: string) => {
                                toast.error(e);
                              },
                            );
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
            </div>
          </div>
        </div>
        {(pendingUserEntryData || userEntryData) && (
          <div className="h-full py-6 pr-8">
            <ModifyUserEntry
              {...{
                pendingUserEntryData,
                userEntryData,
                setUserEntryData,
                fetchEntries,
                getUserEntryData,
                user,
                setPendingDataFetch,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
