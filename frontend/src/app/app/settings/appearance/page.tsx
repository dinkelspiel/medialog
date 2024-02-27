"use client";

import React from "react";
import { useSidebarContext } from "../../sidebar-provider";
import Header from "@/components/header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { useUserContext } from "../../user-provider";
import { cn } from "@/lib/utils";
import { RatingStyle } from "@/interfaces/user";
import { toast } from "sonner";

const Appearance = () => {
  const { setSidebarSelected } = useSidebarContext();
  setSidebarSelected("settings");

  const { user, setUser } = useUserContext();

  if (user === undefined) return <div></div>;

  const [ratingStyleOpen, setRatingStyleOpen] = React.useState(false);

  const setUserRatingStyle = async (ratingStyle: RatingStyle) => {
    const response = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionToken: localStorage.getItem("sessionToken"),
          ratingStyle: ratingStyle.toLowerCase(),
        }),
      },
    );

    toast.promise(response, {
      loading: "Loading...",
      success: () => {
        setUser({
          ...user,
          ratingStyle: ratingStyle.toLowerCase() as RatingStyle,
        });
        return `Successfully saved Rating Style`;
      },
      error: "Error saving Rating Style",
    });
  };

  return (
    <>
      <Header
        title="Appearance"
        subtext="Personalize medialog to your liking"
      />
      <div className="flex flex-col gap-1.5">
        <Label className="font-medium">Rating Style</Label>
        <Popover open={ratingStyleOpen} onOpenChange={setRatingStyleOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[200px] justify-between"
            >
              {`${user.ratingStyle[0].toUpperCase()}${user.ratingStyle.substring(1, user.ratingStyle.length)}`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandGroup>
                {["Stars", "Range"].map((ratingStyle) => (
                  <CommandItem
                    key={ratingStyle}
                    value={ratingStyle}
                    onSelect={(currentValue) => {
                      setRatingStyleOpen(false);
                      setUserRatingStyle(
                        currentValue.toLowerCase() as RatingStyle,
                      );
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        user.ratingStyle === ratingStyle.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {ratingStyle}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Label className="text-slate-500">
          This is how you will decide a rating for an entry. Etiher with stars
          or a range slider.
        </Label>
      </div>
    </>
  );
};

export default Appearance;
