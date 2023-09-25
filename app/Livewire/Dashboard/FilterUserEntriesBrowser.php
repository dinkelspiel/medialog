<?php

namespace App\Livewire\Dashboard;

use App\Enums\SortAfterEnum;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\UserEntry;
use Livewire\Component;

class FilterUserEntriesBrowser extends Component
{
    public ?Franchise $franchise = null;

    public bool $includeAllFranchises = false;
    public bool $includeAlreadyWatched = false;

    public array $sortAfter = [];

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

    public function setSortAfter(string $sort)
    {
        if(!in_array($sort, $this->sortAfter))
        {
            return;
        }

        $this->dispatch('setSortAfter', $sort);
    }

    public function render()
    {
        if($this->sortAfter === [])
        {
            $this->sortAfter = array_column(SortAfterEnum::cases(), 'value');
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

        return view('livewire.dashboard.filter-user-entries-browser', [
            'franchise' => $this->franchise,
            'canGetRandom' => $amount >= 1,
            'sortAfter' => $this->sortAfter,
            'includeAllFranchises' => $this->includeAllFranchises,
            'includeAlreadyWatched' => $this->includeAlreadyWatched
        ]);
    }
}
