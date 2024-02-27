"use client";
import ModifyUserEntry from "@/components/dashboard/modifyUserEntry";
import type UserEntryData from "@/interfaces/userEntryData";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUserContext } from "../user-provider";
import { useSidebarContext } from "../sidebar-provider";
import { SortByType } from "@/interfaces/sortByType";
import DashboardHeader from "@/components/dashboard/dashboardHeader";
import { UserEntry } from "@/interfaces/userEntry";
import Entries from "@/components/dashboard/entries";

export default function Home() {
  const [userEntries, setUserEntries] = useState<UserEntry[]>([]);
  const [pendingUserEntries, setPendingUserEntries] = useState(false);
  const [sortBy, setSortByValue] = useState<SortByType>("rating");
  const { user } = useUserContext();
  const [pendingUserEntryData, setPendingDataFetch] = useState(false);
  const [userEntryData, setUserEntryData] = useState<UserEntryData | undefined>(
    undefined,
  );

  const { setSidebarSelected } = useSidebarContext();
  setSidebarSelected("dashboard");

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
      setSortByValue(localStorage.getItem("sortBy") as SortByType);
    }
  }, [user]);

  if (user === undefined) return <div></div>;

  const setSortBy = (value: SortByType) => {
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
            <DashboardHeader setSortBy={setSortBy} sortBy={sortBy} />
            <div className="grid w-[calc(100dvw-64px)] grid-cols-3 gap-4 pt-4 lg:flex lg:w-full lg:flex-row lg:flex-wrap">
              <Entries
                {...{
                  fetchEntries,
                  userEntries,
                  pendingUserEntries,
                  sortBy,
                  getUserEntryData,
                }}
              />
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
