<?php

namespace App\Livewire\Dashboard;

use App\Enums\ActivityTypeEnum;
use App\Enums\SortAfterEnum;
use App\Enums\UserEntryStatusEnum;
use App\Models\Activity;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\Person;
use App\Models\Studio;
use App\Models\User;
use App\Models\UserEntry;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Livewire\Component;

class Index extends Component
{
    public $listeners = [
        "refreshUserEntries" => '$refresh',
        "setSortAfter" => "setSortAfter",
    ];

    protected $rules = [
        "userEntry.rating" => "required",
        "userEntry.notes" => "",
    ];

    public ?UserEntry $userEntry = null;

    public string $sortAfter = "";

    public function cycleSortAfter()
    {
        $sortAfterArray = array_column(SortAfterEnum::cases(), "value");
        $index = array_search($this->sortAfter, $sortAfterArray);

        $key = @$sortAfterArray[$index + 1];
        if ($key == null) {
            $this->sortAfter = $sortAfterArray[0];
            return;
        }

        $this->sortAfter = $key;
    }

    public function showUserEntry(int $id, bool $overrideToLatest = true)
    {
        if ($this->userEntry) {
            if ($this->userEntry->id == $id) {
                $this->userEntry = null;
                return;
            }
        }

        if (!$overrideToLatest) {
            $this->userEntry = UserEntry::where("id", $id)
                ->where("user_id", auth()->user()->id)
                ->first();
        } else {
            $userEntry = UserEntry::where("id", $id)
                ->where("user_id", auth()->user()->id)
                ->first();

            if (is_null($userEntry)) {
                return;
            }

            $this->userEntry = UserEntry::where(
                "entry_id",
                $userEntry->entry_id,
            )
                ->where("user_id", auth()->user()->id)
                ->orderBy("created_at", "DESC")
                ->first();
        }
    }

    public function closeUserEntry()
    {
        $this->userEntry = null;
    }

    public function addRewatchToUserEntry()
    {
        $userEntry = new UserEntry();
        $userEntry->entry_id = $this->userEntry->entry->id;
        $userEntry->user_id = auth()->user()->id;
        $userEntry->rating = 0;
        $userEntry->notes = "";
        $userEntry->status = UserEntryStatusEnum::Watching;
        $userEntry->created_at = Carbon::now();
        $userEntry->save();

        Activity::create([
            "user_id" => auth()->user()->id,
            "entry_id" => $userEntry->entry->id,
            "type" => ActivityTypeEnum::Rewatch,
            "additional_data" =>
                UserEntry::where("entry_id", $userEntry->entry->id)
                    ->where("user_id", auth()->user()->id)
                    ->count() - 1,
        ]);
    }

    public function setUserEntryStatus(string $status)
    {
        $this->userEntry->status = $status;

        if ($status == "completed") {
            $this->userEntry->watched_at = Carbon::now();
            $this->userEntry->progress = $this->userEntry->entry->length;
        }

        Activity::create([
            "user_id" => auth()->user()->id,
            "entry_id" => $this->userEntry->entry->id,
            "type" => ActivityTypeEnum::StatusUpdate,
            "additional_data" =>
                $status .
                "|" .
                UserEntry::where("entry_id", $this->userEntry->entry->id)
                    ->where("user_id", auth()->user()->id)
                    ->count() -
                1,
        ]);

        User::where("id", auth()->user()->id)
            ->first()
            ->pushDailyStreak();

        $this->userEntry->save();
    }

    public function updateUserEntryProgress(int $progress)
    {
        if ($progress < 0) {
            $progress = 0;
        }

        if ($progress > $this->userEntry->entry->length) {
            $progress = $this->userEntry->entry->length;
        }

        User::where("id", auth()->user()->id)
            ->first()
            ->pushDailyStreak();

        if ($progress == $this->userEntry->entry->length) {
            $this->userEntry->watched_at = Carbon::now();
            $this->userEntry->status = UserEntryStatusEnum::Completed;

            $additionalData =
                "completed|" .
                UserEntry::where("entry_id", $this->userEntry->entry->id)
                    ->where("user_id", auth()->user()->id)
                    ->count() -
                1;

            if (
                !Activity::where("user_id", auth()->user()->id)
                    ->where("entry_id", $this->userEntry->entry->id)
                    ->where("additional_data", $additionalData)
                    ->exists()
            ) {
                Activity::create([
                    "user_id" => auth()->user()->id,
                    "entry_id" => $this->userEntry->entry->id,
                    "type" => ActivityTypeEnum::StatusUpdate,
                    "additional_data" => $additionalData,
                ]);
            }
        }

        $this->userEntry->progress = $progress;
        $this->userEntry->save();
    }

    public function setRating(int $rating)
    {
        $this->userEntry->rating = $rating;
    }

    public function saveUserEntry()
    {
        $user = auth()->user();

        if ($this->userEntry->user_id != $user->id) {
            return "You cannot edit a user entry that is not yours.";
        }

        $lastActivity = Activity::where("user_id", auth()->user()->id)
            ->where("type", "!=", "review")
            ->orderBy("id", "DESC")
            ->first();

        if (
            $lastActivity &&
            str_contains($lastActivity->additional_data, "completed") &&
            $lastActivity->type == ActivityTypeEnum::StatusUpdate
        ) {
            $lastActivity->delete();
            Activity::create([
                "user_id" => auth()->user()->id,
                "entry_id" => $this->userEntry->entry->id,
                "type" => ActivityTypeEnum::CompleteReview,
                "additional_data" =>
                    UserEntry::where("entry_id", $this->userEntry->entry->id)
                        ->where("user_id", auth()->user()->id)
                        ->count() - 1,
            ]);
        } elseif (
            UserEntry::where("id", $this->userEntry->id)->first()->rating === 0
        ) {
            Activity::create([
                "user_id" => auth()->user()->id,
                "entry_id" => $this->userEntry->entry->id,
                "type" => ActivityTypeEnum::Reviewed,
                "additional_data" =>
                    UserEntry::where("entry_id", $this->userEntry->entry->id)
                        ->where("user_id", auth()->user()->id)
                        ->count() - 1,
            ]);
        }

        $this->userEntry->save();

        User::where("id", auth()->user()->id)
            ->first()
            ->pushDailyStreak();

        session()->flash("userEntryMessage", "Update successful");
    }

    public function deleteUserEntry()
    {
        $this->userEntry->delete();
        $this->userEntry = null;
    }

    // Filter User Entries Browser

    public ?Franchise $franchise = null;

    public bool $includeAllFranchises = false;
    public bool $includeAlreadyWatched = false;

    public array $sortAfterSelect = [];
    public $filterTitle = "";
    public $filterSeason = "";
    public $filterStudio = "0";
    public $filterSearchStudio = "";
    public $filterCreator = "0";
    public $filterSearchCreator = "";
    public $filterCategory = "0";

    public function setFilterCreator($name)
    {
        $this->filterSearchCreator = $name;
    }

    public function setFilterStudio($name)
    {
        $this->filterSearchStudio = $name;
    }

    public function toggleIncludeAllFranchises()
    {
        $this->includeAllFranchises = !$this->includeAllFranchises;
    }

    public function toggleIncludeAlreadyWatched()
    {
        $this->includeAlreadyWatched = !$this->includeAlreadyWatched;
    }

    public function imFeelingLucky()
    {
        $this->userEntry = UserEntry::where("user_id", auth()->user()->id)
            ->orderByRaw("RAND()")
            ->first();
    }

    public function addFranchise()
    {
        $user = auth()->user();
        foreach ($this->franchise->entries as $entry) {
            $userEntry = new UserEntry();
            $userEntry->entry_id = $entry->id;
            $userEntry->rating = 0;
            $userEntry->notes = "";
            $userEntry->user_id = $user->id;
            $userEntry->save();
        }
        $this->franchise = null;

        $userEntry->refresh();
        $this->dispatch("refreshUserEntries");
    }

    public function render()
    {
        if ($this->sortAfter === "") {
            $this->sortAfter = array_column(SortAfterEnum::cases(), "value")[2];
        }

        $this->filterCreator =
            Person::where("name", $this->filterSearchCreator)->first()->id ??
            "0";
        $this->filterStudio =
            Studio::where("name", $this->filterSearchStudio)->first()->id ??
            "0";

        $filterTitle = $this->filterTitle;
        $userEntries = UserEntry::where("user_id", auth()->user()->id)->with([
            "entry.franchise" => function ($query) use ($filterTitle) {
                if ($filterTitle != "") {
                    $query->where("name", "like", "%" . $filterTitle . "%");
                }
            },
        ]);

        switch ($this->sortAfter) {
            case SortAfterEnum::Watched->value:
                $userEntries = $userEntries
                    ->orderBy("user_entries.watched_at", "desc")
                    ->orderBy("user_entries.id", "desc");
                break;
            case SortAfterEnum::Updated->value:
                $userEntries = $userEntries
                    ->orderBy("user_entries.updated_at", "desc")
                    ->orderBy("user_entries.id", "desc");
                break;
            case SortAfterEnum::Rating->value:
                $userEntries = $userEntries
                    ->orderBy("user_entries.rating", "desc")
                    ->orderBy("user_entries.id", "desc");
                break;
            case SortAfterEnum::AZ->value:
                $userEntries = $userEntries->whereHas(
                    "entry.franchise",
                    function ($query) {
                        $query->orderBy("franchises.name");
                    },
                );
                break;
        }

        if ($this->filterTitle != "") {
            $filterTitle = $this->filterTitle;
            $userEntries = $userEntries->whereHas("entry.franchise", function (
                $query,
            ) use ($filterTitle) {
                $query->where("name", "LIKE", "%" . $filterTitle . "%");
            });
        }
        if ($this->filterSeason != "") {
            $filterSeason = $this->filterSeason;
            $userEntries = $userEntries->whereHas("entry", function (
                $query,
            ) use ($filterSeason) {
                $query->where("name", "LIKE", "%" . $filterSeason . "%");
            });
        }
        if ($this->filterStudio != "0") {
            $studioId = $this->filterStudio;
            $userEntries = $userEntries->whereHas("entry.studios", function (
                $query,
            ) use ($studioId) {
                $query->where("studio_id", $studioId);
            });
        }
        if ($this->filterCategory != "0") {
            $filterCategory = $this->filterCategory;
            $userEntries = $userEntries->whereHas("entry.franchise", function (
                $query,
            ) use ($filterCategory) {
                $query->where("category_id", $filterCategory);
            });
        }
        if ($this->filterCreator != "0") {
            $creatorId = $this->filterCreator;
            $userEntries = $userEntries->whereHas("entry.creators", function (
                $query,
            ) use ($creatorId) {
                $query->where("person_id", $creatorId);
            });
        }
        $userEntries = $userEntries->groupBy("entry_id")->get(); // Filter User Entries

        if ($this->sortAfterSelect === []) {
            $this->sortAfterSelect = array_column(
                SortAfterEnum::cases(),
                "value",
            );
        }

        return view("livewire.dashboard.index", [
            "userEntries" => $userEntries,
        ])->layout("layouts.app", [
            "header" => "dashboard",
        ]);
    }
}
