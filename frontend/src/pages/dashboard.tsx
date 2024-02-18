import AddMedia from "@/components/addMedia";
import ModifyUserEntry from "@/components/dashboard/modifyUserEntry";
import Entry from "@/components/entry";
import Az from "@/components/icons/az";
import Bookmark from "@/components/icons/bookmark";
import Eye from "@/components/icons/eye";
import FlagCheckered from "@/components/icons/flagCheckered";
import Pause from "@/components/icons/pause";
import Pen from "@/components/icons/pen";
import Sort from "@/components/icons/sort";
import Star from "@/components/icons/star";
import StarHalf from "@/components/icons/starHalf";
import StarOutline from "@/components/icons/starOutline";
import Xmark from "@/components/icons/xmark";
import Rating from "@/components/rating";
import RatingSelector from "@/components/ratingSelector";
import Sidebar from "@/components/sidebar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { User } from "@/interfaces/user";
import UserEntryData from "@/interfaces/userEntryData";
import UserEntryStatus from "@/interfaces/userEntryStatus";
import { cn } from "@/lib/utils";
import { BookmarkIcon, EyeOpenIcon, PauseIcon } from "@radix-ui/react-icons";
import { Check, ChevronsDown, ChevronsUpDown } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

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

export default function Home() {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [userEntries, setUserEntries] = useState<UserEntry[]>([]);
  const [pendingUserEntries, setPendingUserEntries] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "az" | "updated" | "watched">(
    "rating",
  );
  const [user, setUser] = useState<User>({ id: 0, username: "", email: "" });
  const [pendingUserEntryData, setPendingDataFetch] = useState(false);
  const [userEntryData, setUserEntryData] = useState<UserEntryData | undefined>(
    undefined,
  );
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const router = useRouter();

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

    response.json().then((data: UserEntry[]) => {
      setUserEntries(data);
      setPendingUserEntries(false);
      clearTimeout(timeout);
    });
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      setPendingUserEntries(true);
    }, 200);

    const getLoggedInUser = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/auth/validate?sessionToken=" +
          localStorage.getItem("sessionToken"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status == 401) {
        router.push("/login");
        return;
      }

      response.json().then((data: User) => {
        setUser(data);
        fetchEntries(data.id, timeout);
      });
    };

    getLoggedInUser();
  }, []);

  const getUserEntryData = async (
    userEntryId: number,
    updateExisting: boolean = false,
  ) => {
    if (userEntryData !== undefined && !updateExisting) {
      if (userEntryData.id === userEntryId) {
        setUserEntryData(undefined);
        return;
      }
    }

    let timeout = setTimeout(() => {
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

    response.json().then((data: UserEntryData) => {
      setUserEntryData(data);
      clearTimeout(timeout);
      setPendingDataFetch(false);
    });
  };

  return (
    <>
      <Head>
        <title>Medialog</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <main className=" w-[100dvw]  text-slate-900">
        <div className="grid grid-cols-1 grid-rows-[72px,1fr] lg:grid-cols-[256px,1fr] lg:grid-rows-1">
          <Sidebar user={user} />
          <div className="grid grid-cols-[1fr,max-content]">
            <div className="scrollable-grid-item no-scrollbar flex flex-row gap-4 px-8 py-6">
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
                        <Tabs defaultValue="rating">
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
                <div className="grid grid-cols-3 gap-4 pt-4 lg:flex lg:flex-row lg:flex-wrap">
                  <AddMedia
                    {...{
                      fetchEntries: () => fetchEntries(user.id),
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
                              return a.franchiseName.localeCompare(
                                b.franchiseName,
                              );
                            case "watched":
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
                                getUserEntryData(userEntry.id);
                              }}
                            />
                          );
                        })
                    : isDesktop
                      ? [...Array(2)].map((_, i) => (
                          <Skeleton
                            key={`desk${i}`}
                            className="relative h-[255px] w-[170px] cursor-pointer"
                          />
                        ))
                      : [...Array(2)].map((_, i) => (
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
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
