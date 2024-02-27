"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { SortByProps, sortByOptions } from "./sortByDesktop";
import { SortByType } from "@/interfaces/sortByType";

function SortByMobile({ setSortBy, sortBy }: SortByProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Label>Sort By</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex flex-row items-center gap-3">
              {sortBy &&
                sortByOptions.find((option) => option.value === sortBy)?.icon}
              {sortBy
                ? sortByOptions.find((option) => option.value === sortBy)?.label
                : "Select Sort By Option..."}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100dvw-64px)] p-0">
          <Command>
            <CommandGroup>
              {sortByOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(_) => {
                    setSortBy(option.value as SortByType);
                    setOpen(false);
                  }}
                  className="flex flex-row gap-3"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      sortBy === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.icon}
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SortByMobile;
