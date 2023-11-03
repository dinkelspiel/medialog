<?php

namespace App\Livewire\Dashboard;

use App\Enums\SortAfterEnum;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\Person;
use App\Models\Studio;
use App\Models\UserEntry;
use Carbon\Carbon;
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

    public $userEntry = null;

    public string $sortAfter = "";

    public function setSortAfter(string $sort)
    {
        $this->sortAfter = $sort;
    }

    public function showUserEntry($id)
    {
        if ($this->userEntry) {
            if ($this->userEntry->id == $id) {
                $this->userEntry = null;
                return;
            }
        }

        $this->userEntry = UserEntry::where("id", $id)
            ->where("user_id", auth()->user()->id)
            ->first();
    }

    public function closeUserEntry()
    {
        $this->userEntry = null;
    }

    public function markAsComplete(int $entryId)
    {
        $user = auth()->user();

        $userEntry = UserEntry::where("id", $entryId)
            ->where("user_id", $user->id)
            ->first();

        if (is_null($userEntry)) {
            return "No valid user entry found";
        }

        $userEntry->watched_at = Carbon::now();
        $userEntry->save();

        $this->userEntry = $userEntry;
    }

    public function setRating(int $rating)
    {
        $this->userEntry->rating = $rating;
        $this->userEntry->save();
    }

    public function saveUserEntry()
    {
        $user = auth()->user();

        if ($this->userEntry->user_id != $user->id) {
            return "You cannot edit a user entry that is not yours.";
        }

        $this->userEntry->save();

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

    public function getRandom()
    {
        $user = auth()->user();

        if (!$this->includeAllFranchises) {
            if ($this->includeAlreadyWatched) {
                $userEntry = UserEntry::inRandomOrder()->where(
                    "user_id",
                    $user->id,
                );
            } else {
                $userEntry = UserEntry::inRandomOrder()
                    ->where("user_id", $user->id)
                    ->where("watched_at", null);
            }

            if ($this->filterTitle != "") {
                $userEntry = $userEntry->whereHas("entry.franchise", function (
                    $query,
                ) {
                    $query->where(
                        "name",
                        "LIKE",
                        "%" . $this->filterTitle . "%",
                    );
                });
            }
            if ($this->filterSeason != "") {
                $filterSeason = $this->filterSeason;
                $userEntry = $userEntry->whereHas("entry", function (
                    $query,
                ) use ($filterSeason) {
                    $query->where("name", "LIKE", "%" . $filterSeason . "%");
                });
            }
            if ($this->filterStudio != "0") {
                $studioId = $this->filterStudio;
                $userEntry = $userEntry->whereHas("entry.studios", function (
                    $query,
                ) use ($studioId) {
                    $query->where("studio_id", $studioId);
                });
            }
            if ($this->filterCategory != "0") {
                $filterCategory = $this->filterCategory;
                $userEntry = $userEntry->whereHas("entry.franchise", function (
                    $query,
                ) use ($filterCategory) {
                    $query->where("category_id", $filterCategory);
                });
            }
            if ($this->filterCreator != "0") {
                $creatorId = $this->filterCreator;
                $userEntry = $userEntry->whereHas("entry.creators", function (
                    $query,
                ) use ($creatorId) {
                    $query->where("person_id", $creatorId);
                });
            }

            $userEntry = $userEntry->first();

            if ($userEntry != null) {
                $this->franchise = $userEntry->entry->franchise;
            } else {
                $this->franchise = null;
            }
        } else {
            if ($this->includeAlreadyWatched) {
                $franchise = Franchise::inRandomOrder()
                    ->whereHas("entries", function ($query) {
                        if ($this->filterStudio != "0") {
                            $query = $query->where(
                                "studio_id",
                                $this->filterStudio,
                            );
                        }
                        if ($this->filterSeason != "") {
                            $query = $query->where(
                                "name",
                                "LIKE",
                                "%" . $this->filterSeason . "%",
                            );
                        }

                        if ($this->filterCreator != "0") {
                            $creatorId = $this->filterCreator;
                            $query = $query->whereHas("creators", function (
                                $q,
                            ) use ($creatorId) {
                                $q->where("person_id", $creatorId);
                            });
                        }
                    })
                    ->has("entries");

                if ($this->filterTitle != "") {
                    $franchise = $franchise->where(
                        "franchises.name",
                        "LIKE",
                        "%" . $this->filterTitle . "%",
                    );
                }
                if ($this->filterCategory != "0") {
                    $franchise = $franchise->where(
                        "franchises.category_id",
                        $this->filterCategory,
                    );
                }
                $franchise = $franchise->inRandomOrder()->first();
            } else {
                $franchise = Entry::inRandomOrder()->whereDoesntHave(
                    "userEntries",
                    function ($query) use ($user) {
                        $query
                            ->where("user_id", $user->id)
                            ->where("watched_at", "!=", null);
                    },
                );

                if ($this->filterTitle != "") {
                    $filterTitle = $this->filterTitle;
                    $franchise = $franchise->whereHas("franchise", function (
                        $query,
                    ) use ($filterTitle) {
                        $query->where("name", "LIKE", "%" . $filterTitle . "%");
                    });
                }
                if ($this->filterSeason != "") {
                    $franchise = $franchise->where(
                        "name",
                        "LIKE",
                        "%" . $this->filterSeason . "%",
                    );
                }
                if ($this->filterStudio != "0") {
                    $studioId = $this->filterStudio;
                    $franchise = $franchise->whereHas("studios", function (
                        $query,
                    ) use ($studioId) {
                        $query->where("studio_id", $studioId);
                    });
                }
                if ($this->filterCategory != "0") {
                    $filterCategory = $this->filterCategory;
                    $franchise = $franchise->whereHas("franchise", function (
                        $query,
                    ) use ($filterCategory) {
                        $query->where("category_id", $filterCategory);
                    });
                }
                if ($this->filterCreator != "0") {
                    $creatorId = $this->filterCreator;
                    $franchise = $franchise->whereHas("creators", function (
                        $query,
                    ) use ($creatorId) {
                        $query->where("person_id", $creatorId);
                    });
                }

                if ($franchise->first() != null) {
                    $this->franchise = $franchise->first()->franchise;
                } else {
                    $this->franchise = null;
                }
            }
        }
    }

    public function canGetRandom()
    {
        $franchise = $this->franchise;
        $this->getRandom();
        $canGetRandom = !is_null($this->franchise);
        $this->franchise = $franchise;
        return $canGetRandom;
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
            $this->sortAfter = array_column(SortAfterEnum::cases(), "value")[0];
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
        $userEntries = $userEntries->get();

        // Filter User Entries

        if ($this->sortAfterSelect === []) {
            $this->sortAfterSelect = array_column(
                SortAfterEnum::cases(),
                "value",
            );
        }

        return view("livewire.dashboard.index", [
            "userEntry" => $this->userEntry,
            "userEntries" => $userEntries,
            "sortAfter" => $this->sortAfter,
            "sortAfterArray" => $this->sortAfterSelect,

            "filterTitle" => $this->filterTitle,

            "franchise" => $this->franchise,
            "canGetRandom" => $this->canGetRandom(),
            "includeAllFranchises" => $this->includeAllFranchises,
            "includeAlreadyWatched" => $this->includeAlreadyWatched,
        ])->layout("layouts.app", [
            "header" => "dashboard",
        ]);
    }
}
