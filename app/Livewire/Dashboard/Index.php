<?php

namespace App\Livewire\Dashboard;

use App\Enums\SortAfterEnum;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\UserEntry;
use Carbon\Carbon;
use Livewire\Component;

class Index extends Component
{
    public $listeners = ['refreshUserEntries' => '$refresh', 'setSortAfter' => 'setSortAfter'];

    protected $rules = [
        'userEntry.rating' => 'required',
        'userEntry.notes' => '',
    ];

    public $userEntry = null;

    public string $sortAfter = "";

    public function setSortAfter(string $sort)
    {
        $this->sortAfter = $sort;
    }

    public function showUserEntry($id)
    {
        $this->userEntry = UserEntry::where('id', $id)->where('user_id', auth()->user()->id)->first();
    }

    public function closeUserEntry()
    {
        $this->userEntry = null;
    }

    public function markAsComplete(int $entryId)
    {
        $user = auth()->user();

        $userEntry = UserEntry::where('id', $entryId)->where('user_id', $user->id)->first();

        if(is_null($userEntry))
        {
            return "No valid user entry found";
        }

        $userEntry->watched_at = Carbon::now();
        $userEntry->save();

        $this->userEntry = $userEntry;
    }

    public function saveUserEntry()
    {
        $user = auth()->user();

        if($this->userEntry->user_id != $user->id)
        {
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
    public $filterProducer = "0";
    public $filterCategory = "0";

    public $page = "add";

    public function setPage(string $page)
    {
        $this->page = $page;
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

        if(!$this->includeAllFranchises)
        {
            if($this->includeAlreadyWatched)
            {
                $userEntry = UserEntry::inRandomOrder()->where('user_id', $user->id);
            } else
            {
                $userEntry = UserEntry::inRandomOrder()->where('user_id', $user->id)->where('watched_at', null);
            }

            $userEntry = $userEntry
                ->join('entries', 'user_entries.entry_id', '=', 'entries.id')
                ->join('franchises', 'entries.franchise_id', 'franchises.id');

            if($this->filterTitle != "")
            {
                $userEntry = $userEntry
                    ->where('franchises.name', 'LIKE', '%' . $this->filterTitle . '%');
            }
            if($this->filterSeason != "")
            {
                $userEntry = $userEntry
                    ->where('entries.name', 'LIKE', '%' . $this->filterSeason . '%');
            }
            if($this->filterStudio != "0")
            {
                $userEntry = $userEntry
                    ->where('entries.studio_id', $this->filterStudio);
            }
            if($this->filterCategory != "0")
            {
                $userEntry = $userEntry
                    ->where('franchises.category_id', $this->filterCategory);
            }

            $userEntry = $userEntry->first();

            if($userEntry != null)
            {
                $this->franchise = $userEntry->entry->franchise;
            } else {
                $this->franchise = null;
            }
        } else {
            if($this->includeAlreadyWatched)
            {
                $franchise = Franchise::inRandomOrder()
                ->whereHas('entries', function ($query) {
                    if($this->filterStudio != "0")
                    {
                        $query->where('studio_id', $this->filterStudio);
                    }
                    if($this->filterSeason != "")
                    {
                        $query->where('name', 'LIKE', '%' . $this->filterSeason . '%');
                    }
                })
                ->has('entries');

                if($this->filterTitle != "")
                {
                    $franchise = $franchise
                        ->where('franchises.name', 'LIKE', '%' . $this->filterTitle . '%');
                }
                if($this->filterCategory != "0")
                {
                    $franchise = $franchise
                        ->where('franchises.category_id', $this->filterCategory);
                }
                $franchise = $franchise->first();
            } else
            {
                $franchise = Entry::inRandomOrder()->whereDoesntHave('userEntries', function ($query) use ($user) {
                    $query->where('user_id', $user->id)->where('watched_at', '!=', null);
                })
                ->join('franchises', 'entries.franchise_id', 'franchises.id');

                if($this->filterTitle != "")
                {
                    $franchise = $franchise
                        ->where('franchises.name', 'LIKE', '%' . $this->filterTitle . '%');
                }
                if($this->filterSeason != "")
                {
                    $franchise = $franchise
                        ->where('entries.name', 'LIKE', '%' . $this->filterSeason . '%');
                }
                if($this->filterStudio != "0")
                {
                    $franchise = $franchise
                        ->where('entries.studio_id', $this->filterStudio);
                }
                if($this->filterCategory != "0")
                {
                    $franchise = $franchise
                        ->where('franchises.category_id', $this->filterCategory);
                }

                $this->franchise = $franchise->first()->franchise;
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
        foreach($this->franchise->entries as $entry)
        {
            $userEntry = new UserEntry;
            $userEntry->entry_id = $entry->id;
            $userEntry->rating = 0;
            $userEntry->notes = "";
            $userEntry->user_id = $user->id;
            $userEntry->save();
        }
        $this->franchise = null;

        $userEntry->refresh();
        $this->dispatch('refreshUserEntries');
    }

    public function render()
    {
        if($this->sortAfter === "")
        {
            $this->sortAfter = array_column(SortAfterEnum::cases(), 'value')[0];
        }

        $filterTitle = $this->filterTitle;
        $userEntries = UserEntry::where('user_id', auth()->user()->id)->with([
            'entry.franchise' => function ($query) use ($filterTitle) {
                if($filterTitle != "")
                {
                    $query->where('name', 'like', '%' . $filterTitle . '%');
                }
            }
        ])
            ->join('entries', 'user_entries.entry_id', '=', 'entries.id')
            ->join('franchises', 'entries.franchise_id', 'franchises.id');

        switch($this->sortAfter)
        {
            case SortAfterEnum::Watched->value:
                $userEntries = $userEntries->orderBy('watched_at', 'desc')->orderBy('user_entries.id', 'desc');
                break;
            case SortAfterEnum::Updated->value:
                $userEntries = $userEntries->orderBy('updated_at', 'desc')->orderBy('user_entries.id', 'desc');
                break;
            case SortAfterEnum::Rating->value:
                $userEntries = $userEntries->orderBy('rating', 'desc')->orderBy('user_entries.id', 'desc');
                break;
            case SortAfterEnum::AZ->value:
                $userEntries = $userEntries->with(['entry.franchise'])
                    ->orderBy('franchises.name') // order by franchise name
                    ->select('user_entries.*'); // select only user_entries fields to avoid field name conflicts
                break;
        }

        if($this->filterTitle != "")
        {
            $userEntries = $userEntries
                ->where('franchises.name', 'LIKE', '%' . $this->filterTitle . '%');
        }
        if($this->filterSeason != "")
        {
            $userEntries = $userEntries
                ->where('entries.name', 'LIKE', '%' . $this->filterSeason . '%');
        }
        if($this->filterStudio != "0")
        {
            $userEntries = $userEntries
                ->where('entries.studio_id', $this->filterStudio);
        }
        if($this->filterCategory != "0")
        {
            $userEntries = $userEntries
                ->where('franchises.category_id', $this->filterCategory);
        }
        $userEntries = $userEntries->get();

        // Filter User Entries

        if($this->sortAfterSelect === [])
        {
            $this->sortAfterSelect = array_column(SortAfterEnum::cases(), 'value');
        }

        return view('livewire.dashboard.index', [
            'userEntry' => $this->userEntry,
            'userEntries' => $userEntries,
            'sortAfter' => $this->sortAfter,
            'sortAfterArray' => $this->sortAfterSelect,

            'filterTitle' => $this->filterTitle,

            'franchise' => $this->franchise,
            'canGetRandom' => $this->canGetRandom(),
            'includeAllFranchises' => $this->includeAllFranchises,
            'includeAlreadyWatched' => $this->includeAlreadyWatched
        ])->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
