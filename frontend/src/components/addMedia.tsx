import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Spinner from "./icons/spinner";
import { Franchise } from "@/interfaces/franchise";
import Image from "next/image";
import { Checkbox } from "./ui/checkbox";
import Star from "./icons/star";
import StarOutline from "./icons/starOutline";
import { Textarea } from "./ui/textarea";
import { ChevronLeft, LucideStarHalf, StarHalfIcon } from "lucide-react";
import StarHalf from "./icons/starHalf";
import { Entry } from "@/interfaces/entry";
import RatingSelector from "./ratingSelector";
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent } from "./ui/drawer";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

interface AddMediaProps {
  fetchEntries: () => void;
  userId: number;
}

const AddMedia = (props: AddMediaProps) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [expandNotes, setExpandNotes] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex cursor-pointer items-center justify-center rounded-md border border-slate-200 text-base font-medium duration-100 hover:bg-slate-100 lg:h-[255px] lg:w-[170px] lg:text-lg"
      >
        Add Media
      </button>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
          <DialogContent
            className={cn(expandNotes ? "w-full max-w-[30dvw]" : "")}
          >
            <AddMediaContent
              {...{
                ...props,
                setExpandNotes,
                expandNotes,
                setDrawerOpen: setOpen,
              }}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onClose={() => setOpen(false)}>
          <DrawerContent className="h-[90dvh]">
            <CardContent className="h-full space-y-4">
              <AddMediaContent
                {...{
                  ...props,
                  setExpandNotes,
                  expandNotes,
                  setDrawerOpen: setOpen,
                }}
              />
            </CardContent>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

interface AddMediaContentProps extends AddMediaProps {
  setExpandNotes: Dispatch<SetStateAction<boolean>>;
  expandNotes: boolean;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const AddMediaContent = ({
  fetchEntries,
  userId,
  setExpandNotes,
  expandNotes,
  setDrawerOpen,
}: AddMediaContentProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchEntries, setSearchEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>(
    undefined,
  );
  const [pendingDataFetch, setPendingDataFetch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [watchedNow, setWatchedNow] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let timeoutId;

    const fetchData = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/entries?limit=10&q=" + searchValue,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      response.json().then((entries: Entry[]) => {
        const formattedEntries = [];
        entries.forEach((entry) => {
          formattedEntries.push({
            id: entry.id,
            name: entry.name,
            releaseYear: 2023,
            creators: entry.creators,
            category: entry.category,
            coverUrl: entry.coverUrl,
          });
        });
        setSearchEntries(formattedEntries);
      });

      setPendingDataFetch(false);
      setHasSearched(true);
    };

    if (searchValue !== "") {
      setPendingDataFetch(true);
      timeoutId = setTimeout(fetchData, 500);
    }

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const saveChanges = () => {
    if (watchedNow) {
      addMediaWithReview();
    } else {
      addMediaWithoutReview();
    }
  };

  const addMediaWithReview = async () => {
    const response = fetch(
      process.env.NEXT_PUBLIC_API_URL + `/users/${userId}/entries`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryId: selectedEntry.id,
          sessionToken: localStorage.getItem("sessionToken"),
          rating: rating,
          notes: notes,
        }),
      },
    );

    toast.promise(response, {
      loading: "Loading...",
      success: () => {
        fetchEntries();
        setSelectedEntry(undefined);
        setExpandNotes(false);
        setNotes("");
        setRating(0);
        setSearchValue("");
        setDrawerOpen(false);
        return `Successfully added entry`;
      },
      error: "Error",
    });
  };

  const addMediaWithoutReview = async () => {
    const response = fetch(
      process.env.NEXT_PUBLIC_API_URL + `/users/${userId}/entries`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryId: selectedEntry.id,
          sessionToken: localStorage.getItem("sessionToken"),
        }),
      },
    );

    toast.promise(response, {
      loading: "Loading...",
      success: () => {
        fetchEntries();
        setSelectedEntry(undefined);
        setExpandNotes(false);
        setNotes("");
        setRating(0);
        setSearchValue("");
        setDrawerOpen(false);
        return `Successfully added entry`;
      },
      error: "Error",
    });
  };

  const generateAddToPlanned = (category: string): string => {
    switch (category) {
      case "Movie":
        return "Add film to your planned to watch?";
      case "Series":
        return "Add show to your planned to watch?";
      case "Book":
        return "Add book to your planned to read?";
      default:
        return `Add ${category} to your planned?`;
    }
  };

  return (
    <>
      {/* Select media */}
      {selectedEntry === undefined && (
        <>
          <DialogHeader>
            <DialogTitle>Add Media</DialogTitle>
          </DialogHeader>
          <div className="flex h-full w-full flex-col space-y-1.5">
            <Label htmlFor="name">Name of media</Label>
            <div className="relative">
              <Input
                value={searchValue}
                onFocus={() => setOpen(true)}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {pendingDataFetch && (
                <Spinner className="absolute right-[4px] top-[10px]" />
              )}
            </div>
            <div className="relative">
              <Card
                className={cn(
                  "static flex w-full flex-col space-y-1.5 border-none p-0 shadow-none lg:absolute lg:border lg:p-1 lg:shadow",
                  !open ||
                    (searchEntries.length === 0 && !hasSearched) ||
                    (searchValue === "" &&
                      hasSearched &&
                      searchEntries.length === 0)
                    ? "hidden"
                    : "block",
                )}
              >
                {searchEntries.map((entry) => {
                  if (
                    !entry.name
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  ) {
                    return;
                  }

                  return (
                    <div key={entry.id}>
                      <Button
                        onClick={() => {
                          setSelectedEntry(entry);
                        }}
                        className="w-full justify-start !px-0 lg:!px-4"
                        variant="ghost"
                      >
                        {entry.name} (2023)
                        <span className="text-xs font-normal text-slate-500">
                          {entry.creators.map((creator, idx) => (
                            <span key={creator}>
                              {creator}
                              {entry.creators.length - 1 !== idx ? ", " : ""}
                            </span>
                          ))}
                        </span>
                      </Button>
                      <Separator className="block lg:hidden" />
                    </div>
                  );
                })}
                {hasSearched && searchEntries.length === 0 && (
                  <div className="w-full py-1.5 text-center">
                    No media found
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
      {/* Personalize media */}
      {selectedEntry !== undefined && (
        <>
          <DialogHeader className="flex flex-row items-end gap-3">
            <Button variant="ghost" onClick={() => setSelectedEntry(undefined)}>
              <ChevronLeft />
              Back
            </Button>
            <span className="text-2xl font-semibold">{selectedEntry.name}</span>
            <span className="text-slate-500">2023</span>
          </DialogHeader>
          <div className="grid grid-cols-[156px,1fr] gap-3">
            <img
              src={selectedEntry.coverUrl}
              alt={""}
              className="h-[231px] w-[156px] rounded-md object-cover"
            />
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="watched-now"
                  defaultChecked={watchedNow}
                  onClick={() => setWatchedNow((state) => !state)}
                />
                <label
                  htmlFor="watched-now"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {watchedNow
                    ? `Watched on ${new Date().toDateString()}`
                    : generateAddToPlanned(selectedEntry.category)}
                </label>
              </div>
              {watchedNow && (
                <>
                  <div className="flex w-full flex-col space-y-1.5">
                    <div className="flex flex-row">
                      <Label htmlFor="name">Rating</Label>
                      <div className="ms-auto text-sm leading-none text-slate-500">
                        {rating / 20}
                      </div>
                    </div>
                    <RatingSelector
                      userEntryId={selectedEntry.id}
                      rating={rating}
                      setRating={(rating) => {
                        setRating(rating);
                      }}
                    />
                  </div>
                  <div className="flex h-full w-full flex-col space-y-1.5">
                    <Label htmlFor="framework">Notes</Label>
                    <Textarea
                      id="name"
                      placeholder={`I absolutely loved ${selectedEntry.name}...`}
                      className={cn(
                        "h-full w-full resize-none",
                        expandNotes ? "h-[70dvh]" : "",
                      )}
                      onFocus={() => setExpandNotes(true)}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </>
              )}
              <DialogClose asChild className="hidden lg:block">
                <Button
                  className="ms-auto w-full"
                  onClick={() => saveChanges()}
                >
                  {watchedNow ? "Save" : "Add"}
                </Button>
              </DialogClose>
            </div>
          </div>
          <DialogClose asChild className="block lg:hidden">
            <Button className="ms-auto w-full" onClick={() => saveChanges()}>
              {watchedNow ? "Save" : "Add"}
            </Button>
          </DialogClose>
        </>
      )}
    </>
  );
};

export default AddMedia;
