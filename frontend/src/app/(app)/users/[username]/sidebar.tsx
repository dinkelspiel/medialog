import { useMediaQuery } from "usehooks-ts";
import { ProfileType } from "./page";
import SmallRating from "@/components/smallRating";
import Calendar from "@/components/icons/calendar";

export const ProfileSidebar = ({ profile }: { profile: ProfileType }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)", {
    defaultValue: true,
    initializeWithValue: false,
  });

  const monthOrder = [
    "DEC",
    "NOV",
    "OCT",
    "SEP",
    "AUG",
    "JUL",
    "JUN",
    "MAY",
    "APR",
    "MAR",
    "FEB",
    "JAN",
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between border-b border-b-slate-200 pb-2 text-lg font-medium">
          Watchlist
          <span className="ms-auto text-slate-500">
            {profile.watchlistCount}
          </span>
        </div>
        <div className="flex flex-row justify-center">
          {profile.watchlist.map((watchlist, idx) => (
            <img
              src={watchlist.coverUrl}
              className={`${idx !== 0 && "ms-[-24px]"} h-[120px] w-[80px] rounded-md shadow-lg`}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 lg:items-start">
        <div className="flex w-full justify-between border-b border-b-slate-200 pb-2 text-lg font-medium">
          Ratings
          <span className="ms-auto text-slate-500">{profile.ratingsCount}</span>
        </div>
        <div className="flex w-full flex-row items-end justify-between gap-2 lg:w-[250px]">
          <SmallRating rating={20} className="pb-1" />
          <div className="flex w-[135px] flex-row items-end gap-0.5 border-b border-b-slate-200 pb-1">
            {profile.ratings.map((ratingPercentage) => (
              <div
                className="w-full bg-slate-300"
                style={{ height: 110 * ratingPercentage }}
              ></div>
            ))}
          </div>
          <SmallRating rating={100} className="pb-1" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {profile.dailyStreak != 0 && !profile.dailyStreakUpdated && (
          <div className="w-full rounded-md border bg-red-500 py-1 text-center text-white">
            Daily streak hasn't been updated
          </div>
        )}
        <div className="flex w-full justify-between border-b border-b-slate-200 pb-2 text-lg font-medium">
          Diary
          <span className="ms-auto text-slate-500">
            {profile.dailyStreak} Day Streak
          </span>
        </div>
        {Object.keys(profile.diary)
          .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
          .map((month) => (
            <div className="grid grid-cols-[42px,1fr] gap-2">
              <div className="relative h-max w-max">
                <div className="absolute top-1/2 w-full -translate-y-[3px] text-center text-[11px] font-semibold text-white">
                  {month}
                </div>
                <Calendar />
              </div>
              <div className="grid grid-cols-[max-content,1fr] gap-2 text-sm font-medium">
                {profile.diary[month].map((day) => (
                  <>
                    <div className="text-slate-500">{day.day}</div>
                    <div className="whitespace-break-spaces">
                      {day.franchiseName}
                      {day.entries > 1 && `: ${day.entryName}`}
                    </div>
                  </>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
