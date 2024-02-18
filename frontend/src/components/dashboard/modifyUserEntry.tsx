import React, { Dispatch, SetStateAction, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import RatingSelector from "../ratingSelector";
import { Textarea } from "../ui/textarea";
import { Toggle } from "../ui/toggle";
import Bookmark from "../icons/bookmark";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Pause from "../icons/pause";
import Xmark from "../icons/xmark";
import FlagCheckered from "../icons/flagCheckered";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { AlertTriangle, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import Rating from "../rating";
import UserEntryData from "@/interfaces/userEntryData";
import { User } from "@/interfaces/user";
import UserEntryStatus from "@/interfaces/userEntryStatus";
import Eye from "../icons/eye";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "../ui/drawer";
import { useMediaQuery } from "usehooks-ts";
import { toast } from "sonner";
import { Slider } from "../ui/slider";

interface ModifyUserEntryProps {
  pendingUserEntryData: boolean;
  userEntryData: UserEntryData;
  setUserEntryData: Dispatch<SetStateAction<UserEntryData>>;
  fetchEntries: (userId: number) => Promise<void>;
  getUserEntryData: (
    userEntryId: number,
    updateExisting?: boolean,
  ) => Promise<void>;
  user: User;
}

const UpdateInformation = ({
  userEntryData,
  setUserEntryData,
}: {
  userEntryData: UserEntryData;
  setUserEntryData: Dispatch<SetStateAction<UserEntryData>>;
}) => {
  const [open, setOpen] = useState(false);

  const saveChanges = async () => {
    const response = fetch(
      process.env.NEXT_PUBLIC_API_URL + `/entries/${userEntryData.entryId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken: localStorage.getItem("sessionToken"),
          franchiseName: userEntryData.franchiseName,
          name: userEntryData.entryName,
          length: userEntryData.entryLength,
          coverUrl: userEntryData.entryCoverUrl,
        }),
      },
    );

    toast.promise(response, {
      loading: "Loading...",
      success: () => {
        setOpen(false);
        return `Successfully saved changes for entry ${userEntryData.franchiseName}: ${userEntryData.entryName}`;
      },
      error: "Error",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <AlertTriangle className="h-[15px] w-[15px]" />
          Update incorrect information
        </Button>
      </DialogTrigger>
      <DialogContent>
        {userEntryData && (
          <>
            <DialogHeader>
              <DialogTitle>
                Update {userEntryData.franchiseName}: {userEntryData.entryName}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-row gap-3">
              <div className="flex h-full w-full flex-col space-y-1.5">
                <Label htmlFor="name">Franchise Name</Label>
                <Input
                  value={userEntryData.franchiseName}
                  onChange={(e) =>
                    setUserEntryData({
                      ...userEntryData,
                      franchiseName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex h-full w-full flex-col space-y-1.5">
                <Label htmlFor="name">Entry Name</Label>
                <Input
                  value={userEntryData.entryName}
                  onChange={(e) =>
                    setUserEntryData({
                      ...userEntryData,
                      entryName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex h-full w-full flex-col space-y-1.5">
              <Label htmlFor="name">Length</Label>
              <Input
                type="number"
                value={userEntryData.entryLength}
                onChange={(e) =>
                  setUserEntryData({
                    ...userEntryData,
                    entryLength: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex h-full w-full flex-col space-y-1.5">
              <Label htmlFor="name">Cover Url</Label>
              <Input
                value={userEntryData.entryCoverUrl}
                onChange={(e) =>
                  setUserEntryData({
                    ...userEntryData,
                    entryCoverUrl: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={() => saveChanges()}>Save Changes</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ModifyUserContent = (props: ModifyUserEntryProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      {isDesktop ? (
        <Card className="hidden h-full w-[23vw] grid-rows-[max-content,1fr,max-content] lg:grid">
          <ModifyUserEntryContent {...props} />
        </Card>
      ) : (
        <Drawer
          open={props.userEntryData !== undefined}
          onClose={() => props.setUserEntryData(undefined)}
        >
          <DrawerContent>
            <ModifyUserEntryContent {...props} />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ModifyUserContent;

const ModifyUserEntryContent = ({
  pendingUserEntryData,
  userEntryData,
  setUserEntryData,
  fetchEntries,
  getUserEntryData,
  user,
}: ModifyUserEntryProps) => {
  const [rewatchOpen, setRewatchOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const saveUserEntryData = async () => {
    const response = fetch(
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

    toast.promise(response, {
      loading: "Loading...",
      success: () => {
        fetchEntries(user.id);
        getUserEntryData(userEntryData.id, true);
        return `Successfully saved changes for entry ${userEntryData.franchiseName}: ${userEntryData.entryName}`;
      },
      error: "Error",
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
            <div className="text-slate-500">{userEntryData.releaseYear}</div>
          </>
        ) : (
          ""
        )}
        <div className="ms-auto hidden h-full items-start lg:flex">
          <button onClick={() => setUserEntryData(undefined)}>
            <Xmark />
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex h-full w-full flex-col items-center gap-3">
          {/* User Entry has been completed */}

          {(pendingUserEntryData || userEntryData.watchedAt !== null) && (
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
                    user.ratingStyle === "stars" ? (
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
                      <Slider
                        defaultValue={[userEntryData.rating]}
                        onValueChange={(e) =>
                          setUserEntryData({
                            ...userEntryData,
                            rating: e[0],
                          })
                        }
                      />
                    )
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
                    className="h-full min-h-[100px] w-full resize-none"
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
            ((userEntryData ?? { watchedAt: null }).watchedAt === null && (
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
                  <div className="w-full text-center">Planning to watch</div>
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
                    <Separator orientation="vertical" className="bg-primary" />
                    <div className="flex w-full flex-col space-y-1.5 py-1.5">
                      <Label htmlFor="name">Amount of episodes watched</Label>
                      <div className="flex flex-row items-center gap-2">
                        <Input
                          defaultValue={userEntryData.progress ?? 0}
                          type="number"
                          onChange={(e) => {
                            if (Number(e.target.value) < 0) {
                              return;
                            }
                            updateUserEntryProgress(Number(e.target.value));
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
                    <Separator orientation="vertical" className="bg-primary" />
                    <div className="flex w-full flex-col space-y-1.5 py-1.5">
                      <Label htmlFor="name">Amount of episodes watched</Label>
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
                  <div className="w-full text-center">Did not finish</div>
                </Toggle>
                {userEntryData.status === "dnf" && (
                  <div className="flex flex-row gap-3 py-1.5">
                    <Separator orientation="vertical" className="bg-primary" />
                    <div className="flex w-full flex-col space-y-1.5 py-1.5">
                      <Label htmlFor="name">Amount of episodes watched</Label>
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
                      <Popover open={rewatchOpen} onOpenChange={setRewatchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {userEntryData.watchedAt ?? "Currently Watching"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandEmpty>
                              {userEntryData.watchedAt ?? "Currently Watching"}
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
                                        userEntryData.id === userEntry.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <div className="flex gap-16">
                                      {userEntry.watchedAt ??
                                        "Currently Watching"}
                                      <Rating rating={userEntry.rating} />
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
            {pendingUserEntryData && <Skeleton className="h-[36px] w-full" />}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex h-full flex-col gap-3">
        <UpdateInformation {...{ userEntryData, setUserEntryData }} />

        {pendingUserEntryData ? (
          <>
            <Skeleton className="h-[36px] w-[85px]" />
            <Skeleton className="h-[36px] w-[120px]" />
          </>
        ) : userEntryData ? (
          <div className="flex w-full flex-col justify-between gap-3 xl:flex-row">
            <Button variant="outline" className="w-full xl:w-max">
              Remove
            </Button>
            <Button
              className="w-full xl:w-max"
              onClick={() => saveUserEntryData()}
            >
              Save Changes
            </Button>
          </div>
        ) : (
          ""
        )}
      </CardFooter>
    </>
  );
};
