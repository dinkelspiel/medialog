import AddMedia from "@/components/addMedia";
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
import { cn } from "@/lib/utils";
import { BookmarkIcon, EyeOpenIcon, PauseIcon } from "@radix-ui/react-icons";
import { Check, ChevronsDown, ChevronsUpDown } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type UserEntryStatus = "planning" | "watching" | "dnf" | "paused" | "completed";

interface UserEntry {
  id: number;
  franchiseName: string;
  entryName: string;
  coverUrl: string;
  entries: number;
  updatedAt: string;
  rating: number;
  status: UserEntryStatus;
}

interface UserEntryData {
  id: number;
  franchiseName: string;
  entryName: string;
  releaseYear: number;
  entries: number;
  userEntries: { id: number; rating: number; watchedAt?: string }[];
  rating: number;
  notes: string;
  status: UserEntryStatus;
  entryLength: number;
  entryId: number;
  progress: number;
  watchedAt?: string;
}

export default function Home() {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [userEntries, setUserEntries] = useState<UserEntry[]>([]);
  const [sortBy, setSortBy] = useState<"rating" | "az" | "updated" | "watched">(
    "rating",
  );
  const [user, setUser] = useState<User>({ id: 0, username: "", email: "" });
  const [pendingUserEntryData, setPendingDataFetch] = useState(false);
  const [userEntryData, setUserEntryData] = useState<UserEntryData | undefined>(
    undefined,
  );

  const [rewatchOpen, setRewatchOpen] = useState(false);

  const router = useRouter();

  const fetchEntries = async (userId: number) => {
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
    });
  };

  useEffect(() => {
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
        fetchEntries(data.id);
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

  const saveUserEntryData = async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/users/${user.id}/entries/${userEntryData.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken: localStorage.getItem("sessionToken"),
          rating: userEntryData.rating,
          notes: userEntryData.notes,
        }),
      },
    );

    response.json().then((data) => {
      fetchEntries(user.id);
      getUserEntryData(userEntryData.id, true);
    });
  };

  const updateUserEntryStatus = async (status: UserEntryStatus) => {
    setUserEntryData({ ...userEntryData, status });
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/users/${user.id}/entries/${userEntryData.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken: localStorage.getItem("sessionToken"),
          status: status,
        }),
      },
    );

    response.json().then((data) => {
      getUserEntryData(userEntryData.id, true);
    });
  };

  const addRewatch = async (entryId: number) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/users/${user.id}/entries`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryId: entryId,
          sessionToken: localStorage.getItem("sessionToken"),
        }),
      },
    );

    response.json().then((data: { message: string; id: number }) => {
      fetchEntries(user.id);
      getUserEntryData(data.id);
      setRewatchOpen(false);
    });
  };

  const updateUserEntryProgress = async (progress: number) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/users/${user.id}/entries/${userEntryData.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken: localStorage.getItem("sessionToken"),
          progress,
        }),
      },
    );

    response.json().then((data: { message: string }) => {
      getUserEntryData(userEntryData.id, true);
    });
  };

  return (
    <>
      <Head>
        <title>Medialog</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grid w-[100dvw] grid-cols-[256px,1fr,max-content] text-slate-900">
        <Sidebar />
        <div className="scrollable-grid-item no-scrollbar flex flex-row gap-4 px-8 py-6">
          <div className="w-full">
            <div className="flex w-full flex-col gap-4  border-b border-slate-200 pb-4">
              <div className="flex flex-row ">
                <div className="flex w-full flex-col">
                  <div className="text-2xl font-semibold">My Media</div>
                  <div className="text-sm text-slate-500">
                    Search through your entire media catalogue
                  </div>
                </div>
                <div className="flex w-full justify-end gap-3">
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
            <div className="flex flex-row flex-wrap gap-4 pt-4">
              {userEntries
                .sort((a, b) => {
                  switch (sortBy) {
                    case "rating":
                      return b.rating - a.rating;
                    case "az":
                      return a.franchiseName.localeCompare(b.franchiseName);
                    case "updated":
                      return 0;
                    case "watched":
                      return 0;
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
                })}
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative flex h-[255px] w-[170px] cursor-pointer items-center justify-center rounded-md border border-slate-200 text-lg font-medium duration-100 hover:bg-slate-100">
                    Add Media
                  </div>
                </DialogTrigger>
                <AddMedia
                  fetchEntries={() => fetchEntries(user.id)}
                  userId={user.id}
                />
              </Dialog>
            </div>
          </div>
        </div>
        {(pendingUserEntryData || userEntryData) && (
          <div className="h-full py-6 pr-8">
            <Card className="grid h-full w-[450px] grid-rows-[max-content,1fr,60px]">
              <CardHeader className="flex flex-row items-end gap-3">
                {pendingUserEntryData ? (
                  <>
                    <Skeleton className="h-8 w-[60%]" />
                  </>
                ) : userEntryData !== undefined ? (
                  <>
                    <h2 className="text-2xl font-semibold">
                      {userEntryData.entries > 1
                        ? `${userEntryData.franchiseName}: ${userEntryData.entryName}`
                        : userEntryData.franchiseName}
                    </h2>
                    <div className="text-slate-500">
                      {userEntryData.releaseYear}
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="ms-auto flex h-full items-start">
                  <button onClick={() => setUserEntryData(undefined)}>
                    <Xmark />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex h-full w-full flex-col items-center gap-3">
                  {/* User Entry has been completed */}

                  {(pendingUserEntryData ||
                    userEntryData.watchedAt !== null) && (
                    <>
                      <div className="flex w-full flex-col space-y-1.5">
                        {pendingUserEntryData ? (
                          <Skeleton className="h-[14px] w-[45px]" />
                        ) : userEntryData ? (
                          <div className="flex flex-row">
                            <Label htmlFor="name">Rating</Label>
                            <div className="ms-auto text-sm leading-none text-slate-500">
                              {userEntryData.rating / 20}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="flex flex-row justify-center gap-2">
                          {pendingUserEntryData ? (
                            <>
                              <Skeleton className="h-[22px] w-[150px]" />
                            </>
                          ) : userEntryData ? (
                            <RatingSelector
                              userEntryId={userEntryData.id}
                              rating={userEntryData.rating}
                              setRating={(rating) => {
                                setUserEntryData({
                                  ...userEntryData,
                                  rating: rating,
                                });
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="flex h-full w-full flex-col space-y-1.5">
                        {pendingUserEntryData ? (
                          <Skeleton className="h-[14px] w-[40px]" />
                        ) : userEntryData ? (
                          <Label htmlFor="name">Notes</Label>
                        ) : (
                          ""
                        )}
                        {pendingUserEntryData ? (
                          <Skeleton className="h-full w-full" />
                        ) : userEntryData ? (
                          <Textarea
                            id="name"
                            placeholder={`I absolutely loved ${userEntryData.franchiseName}...`}
                            className="h-full w-full resize-none"
                            value={userEntryData.notes}
                            onChange={(e) => {
                              setUserEntryData({
                                ...userEntryData,
                                notes: e.target.value,
                              });
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </>
                  )}

                  {/* User Entry is being watched  */}
                  {pendingUserEntryData ||
                    ((userEntryData ?? { watchedAt: null }).watchedAt ===
                      null && (
                      <div className="flex h-full w-full flex-col space-y-1.5">
                        <Toggle
                          pressed={userEntryData.status === "planning"}
                          onPressedChange={() => {
                            if (userEntryData.status === "planning") return;
                            updateUserEntryStatus("planning");
                          }}
                          variant="outline"
                          className="justify-start gap-1.5"
                          size="lg"
                        >
                          <Bookmark className="h-[13px]" />
                          <div className="w-full text-center">
                            Planning to watch
                          </div>
                        </Toggle>
                        <Toggle
                          pressed={userEntryData.status === "watching"}
                          onPressedChange={() => {
                            if (userEntryData.status === "watching") return;
                            updateUserEntryStatus("watching");
                          }}
                          variant="outline"
                          className="justify-start gap-1.5"
                          size="lg"
                        >
                          <Eye className="h-[13px]" />
                          <div className="w-full text-center">Watching</div>
                        </Toggle>
                        {userEntryData.status === "watching" && (
                          <div className="flex flex-row gap-3 py-1.5">
                            <Separator
                              orientation="vertical"
                              className="bg-primary"
                            />
                            <div className="flex w-full flex-col space-y-1.5 py-1.5">
                              <Label htmlFor="name">
                                Amount of episodes watched
                              </Label>
                              <div className="flex flex-row items-center gap-2">
                                <Input
                                  defaultValue={userEntryData.progress ?? 0}
                                  type="number"
                                  onChange={(e) => {
                                    if (Number(e.target.value) < 0) {
                                      return;
                                    }
                                    updateUserEntryProgress(
                                      Number(e.target.value),
                                    );
                                  }}
                                />
                                <div className="w-max whitespace-nowrap">
                                  / {userEntryData.entryLength ?? 0}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <Toggle
                          pressed={userEntryData.status === "paused"}
                          onPressedChange={() => {
                            if (userEntryData.status === "paused") return;
                            updateUserEntryStatus("paused");
                          }}
                          variant="outline"
                          className="justify-start gap-1.5"
                          size="lg"
                        >
                          <Pause className="h-[13px]" />
                          <div className="w-full text-center">Paused</div>
                        </Toggle>
                        {userEntryData.status === "paused" && (
                          <div className="flex flex-row gap-3 py-1.5">
                            <Separator
                              orientation="vertical"
                              className="bg-primary"
                            />
                            <div className="flex w-full flex-col space-y-1.5 py-1.5">
                              <Label htmlFor="name">
                                Amount of episodes watched
                              </Label>
                              <div className="flex flex-row items-center gap-2">
                                {userEntryData.progress ?? 0} /{" "}
                                {userEntryData.entryLength ?? 0}
                              </div>
                            </div>
                          </div>
                        )}
                        <Toggle
                          pressed={userEntryData.status === "dnf"}
                          onPressedChange={() => {
                            if (userEntryData.status === "dnf") return;
                            updateUserEntryStatus("dnf");
                          }}
                          variant="outline"
                          className="justify-start gap-1.5"
                          size="lg"
                        >
                          <Xmark className="h-[13px]" />
                          <div className="w-full text-center">
                            Did not finish
                          </div>
                        </Toggle>
                        {userEntryData.status === "dnf" && (
                          <div className="flex flex-row gap-3 py-1.5">
                            <Separator
                              orientation="vertical"
                              className="bg-primary"
                            />
                            <div className="flex w-full flex-col space-y-1.5 py-1.5">
                              <Label htmlFor="name">
                                Amount of episodes watched
                              </Label>
                              <div className="flex flex-row items-center gap-2">
                                {userEntryData.progress ?? 0} /{" "}
                                {userEntryData.entryLength ?? 0}
                              </div>
                            </div>
                          </div>
                        )}
                        <Toggle
                          pressed={userEntryData.status === "completed"}
                          onPressedChange={() => {
                            if (userEntryData.status === "completed") return;
                            updateUserEntryStatus("completed");
                          }}
                          variant="outline"
                          className="justify-start gap-1.5"
                          size="lg"
                        >
                          <FlagCheckered className="h-[13px]" />
                          <div className="w-full text-center">Completed</div>
                        </Toggle>
                      </div>
                    ))}

                  {/* Rewatched dropdown */}
                  <div className="flex w-full flex-col space-y-1.5">
                    {userEntryData &&
                      userEntryData.userEntries.length > 1 &&
                      !pendingUserEntryData && (
                        <>
                          {userEntryData ? (
                            <>
                              <Label htmlFor="name">Rewatches</Label>
                              <Popover
                                open={rewatchOpen}
                                onOpenChange={setRewatchOpen}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                  >
                                    {userEntryData.watchedAt ??
                                      "Currently Watching"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                  <Command>
                                    <CommandEmpty>
                                      {userEntryData.watchedAt ??
                                        "Currently Watching"}
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {userEntryData.userEntries.find(
                                        (e) => e.watchedAt === null,
                                      ) === undefined && (
                                        <div className="mb-1 border-b border-b-slate-200 pb-1">
                                          <Button
                                            className="w-full"
                                            onClick={() =>
                                              addRewatch(userEntryData.entryId)
                                            }
                                          >
                                            Rewatch
                                          </Button>
                                        </div>
                                      )}
                                      {userEntryData.userEntries
                                        .sort((a, b) => b.id - a.id)
                                        .map((userEntry) => (
                                          <CommandItem
                                            key={userEntry.id}
                                            value={
                                              userEntry.watchedAt ??
                                              "Currently Watching"
                                            }
                                            onSelect={() => {
                                              getUserEntryData(userEntry.id);
                                              setRewatchOpen(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                userEntryData.id ===
                                                  userEntry.id
                                                  ? "opacity-100"
                                                  : "opacity-0",
                                              )}
                                            />
                                            <div className="flex gap-16">
                                              {userEntry.watchedAt ??
                                                "Currently Watching"}
                                              <Rating
                                                rating={userEntry.rating}
                                              />
                                            </div>
                                          </CommandItem>
                                        ))}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    {userEntryData &&
                      userEntryData.userEntries.length === 1 &&
                      userEntryData.status === "completed" &&
                      !pendingUserEntryData && (
                        <Button
                          className="w-full"
                          onClick={() => addRewatch(userEntryData.entryId)}
                          variant="outline"
                        >
                          Start Rewatching
                        </Button>
                      )}
                    {pendingUserEntryData && (
                      <Skeleton className="h-[36px] w-full" />
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {pendingUserEntryData ? (
                  <>
                    <Skeleton className="h-[36px] w-[85px]" />
                    <Skeleton className="h-[36px] w-[120px]" />
                  </>
                ) : userEntryData ? (
                  <>
                    <Button variant="outline">Remove</Button>
                    <Button onClick={() => saveUserEntryData()}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </CardFooter>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
