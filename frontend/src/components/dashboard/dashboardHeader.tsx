import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Header from "../header";
import SortByDesktop from "./sortByDesktop";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useMediaQuery } from "usehooks-ts";
import Sort from "../icons/sort";
import Xmark from "../icons/xmark";
import { SortByType } from "@/interfaces/sortByType";
import SortByMobile from "./sortByMobile";
import { DashboardFilter } from "@/app/(app)/dashboard/page";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { UserEntryStatusArray } from "@/interfaces/userEntryStatus";
import { capitalizeFirst } from "@/lib/capitalizeFirst";

interface DashboardHeaderProps {
  sortBy: SortByType;
  setSortBy: (value: SortByType) => void;
  filter: DashboardFilter;
  setFilter: Dispatch<SetStateAction<DashboardFilter>>;
}

type Studio = { name: string };
type Person = { name: string };

const DashboardHeader = ({
  sortBy,
  setSortBy,
  filter,
  setFilter,
}: DashboardHeaderProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [people, setPeople] = useState<Person[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);

  const [filterPeopleOpen, setFilterPeopleOpen] = useState(false);
  const [filterStudiosOpen, setFilterStudiosOpen] = useState(false);
  const [filterStatusOpen, setFilterStatusOpen] = useState(false);

  useEffect(() => {
    const fetchStudios = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/studios",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      response
        .json()
        .then((data: Studio[]) => {
          setStudios(data);
        })
        .catch((e: any) => {
          console.log(e);
        });
    };

    const fetchPeople = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/people",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      response
        .json()
        .then((data: Person[]) => {
          setPeople(data);
        })
        .catch((e: any) => {
          console.log(e);
        });
    };

    fetchPeople();
    fetchStudios();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 pb-4">
      <Header
        title="My Media"
        subtext="Search through your entire media catalogue"
      >
        {isDesktop && <SortByDesktop setSortBy={setSortBy} sortBy={sortBy} />}
        <Button
          variant={!showFilters ? `outline` : `secondary`}
          className="w-9 px-0"
          onClick={() => {
            setShowFilters((x) => !x);
          }}
        >
          {!showFilters ? <Sort /> : <Xmark />}
        </Button>
      </Header>
      {showFilters && (
        <div className="flex flex-col gap-4 border-b border-b-slate-200 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                onChange={(e) =>
                  setFilter({ ...filter, title: e.target.value })
                }
                placeholder="Name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Popover
                open={filterStatusOpen}
                onOpenChange={setFilterStatusOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {filter.status
                      ? filter.status !== "dnf"
                        ? capitalizeFirst(filter.status)
                        : "Did not finish"
                      : "Select status..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandGroup>
                      {UserEntryStatusArray.map((status) => (
                        <CommandItem
                          key={status}
                          value={status}
                          onSelect={(_) => {
                            setFilter({
                              ...filter,
                              status:
                                status === filter.status ? undefined : status,
                            });
                            setFilterStatusOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              filter.status === status
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {status !== "dnf"
                            ? capitalizeFirst(status)
                            : "Did not finish"}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Directors/Writers</Label>
              <Popover
                open={filterPeopleOpen}
                onOpenChange={setFilterPeopleOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {filter.creator
                      ? people.find((person) => person.name === filter.creator)
                          ?.name
                      : "Select person..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search people..." />
                    <CommandEmpty>No people found.</CommandEmpty>
                    <CommandGroup>
                      {people.map((person) => (
                        <CommandItem
                          key={person.name}
                          value={person.name}
                          onSelect={(_) => {
                            setFilter({
                              ...filter,
                              creator:
                                person.name === filter.creator
                                  ? undefined
                                  : person.name,
                            });
                            setFilterPeopleOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              filter.creator === person.name
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {person.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Studios</Label>
              <Popover
                open={filterStudiosOpen}
                onOpenChange={setFilterStudiosOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {filter.studio
                      ? studios.find((studio) => studio.name === filter.studio)
                          ?.name
                      : "Select studio..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search studios..." />
                    <CommandEmpty>No studios found.</CommandEmpty>
                    <CommandGroup>
                      {studios.map((studio) => (
                        <CommandItem
                          key={studio.name}
                          value={studio.name}
                          onSelect={(_) => {
                            setFilter({
                              ...filter,
                              studio:
                                studio.name === filter.studio
                                  ? undefined
                                  : studio.name,
                            });
                            setFilterStudiosOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              filter.studio === studio.name
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {studio.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {!isDesktop && <SortByMobile setSortBy={setSortBy} sortBy={sortBy} />}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
