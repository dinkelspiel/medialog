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
    public string $filterTitle = "";
    public string $filterSeason = "";
    public string $filterStudio = "";
    public string $filterProducer = "";
    public string $filterCategory = "";

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
                $userEntry = UserEntry::inRandomOrder()->where('user_id', $user->id)->first();
            } else
            {
                $userEntry = UserEntry::inRandomOrder()->where('user_id', $user->id)->where('watched_at', null)->first();
            }
            $this->franchise = $userEntry->entry->franchise;
        } else {
            if($this->includeAlreadyWatched)
            {
                $this->franchise = Franchise::inRandomOrder()->has('entries')->first();
            } else
            {
                $this->franchise = Entry::inRandomOrder()->whereDoesntHave('userEntries', function ($query) use ($user) {
                    $query->where('user_id', $user->id)->where('watched_at', '!=', null);
                })->first()->franchise;
            }
        }
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

        $sortTitle = $this->sortTitle;
        $userEntries = UserEntry::where('user_id', auth()->user()->id)->with([
            'entry.franchise' => function ($query) use ($sortTitle) {
                if($sortTitle != "")
                {
                    $query->where('name', 'like', '%' . $sortTitle . '%');
                }
            }
        ]);
        switch($this->sortAfter)
        {
            case SortAfterEnum::Watched->value:
                $userEntries = $userEntries->orderBy('watched_at', 'desc')->orderBy('id', 'desc')->get();
                break;
            case SortAfterEnum::Updated->value:
                $userEntries = $userEntries->orderBy('updated_at', 'desc')->orderBy('id', 'desc')->get();
                break;
            case SortAfterEnum::Rating->value:
                $userEntries = $userEntries->orderBy('rating', 'desc')->orderBy('id', 'desc')->get();
                break;
            case SortAfterEnum::AZ->value:
                $userEntries = $userEntries->with(['entry.franchise'])
                    ->join('entries', 'user_entries.entry_id', '=', 'entries.id') // join the entries table
                    ->join('franchises', 'entries.franchise_id', '=', 'franchises.id') // join the franchises table
                    ->orderBy('franchises.name') // order by franchise name
                    ->select('user_entries.*') // select only user_entries fields to avoid field name conflicts
                    ->get();
                break;
        }

        // Filter User Entries

        if($this->sortAfterSelect === [])
        {
            $this->sortAfterSelect = array_column(SortAfterEnum::cases(), 'value');
        }

        $user = auth()->user();

        if(!$this->includeAllFranchises)
        {
            if($this->includeAlreadyWatched)
            {
                $amount = UserEntry::inRandomOrder()->where('user_id', $user->id)->count();
            } else
            {
                $amount = UserEntry::inRandomOrder()->where('user_id', $user->id)->where('watched_at', null)->count();
            }
        } else {
            if($this->includeAlreadyWatched)
            {
                $amount = Franchise::inRandomOrder()->has('entries')->count();
            } else
            {
                $amount = Entry::inRandomOrder()->whereDoesntHave('userEntries', function ($query) use ($user) {
                    $query->where('user_id', $user->id)->where('watched_at', '!=', null);
                })->count();
            }
        }

        return view('livewire.dashboard.index', [
            'userEntry' => $this->userEntry,
            'userEntries' => $userEntries,
            'sortAfter' => $this->sortAfter,
            'sortAfterArray' => $this->sortAfterSelect,
            
            'filterTitle' => $this->filterTitle,
            
            'franchise' => $this->franchise,
            'canGetRandom' => $amount >= 1,
            'includeAllFranchises' => $this->includeAllFranchises,
            'includeAlreadyWatched' => $this->includeAlreadyWatched
        ])->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
