<?php

namespace App\Livewire\Dashboard;

use App\Models\Entry;
use App\Models\Franchise;
use App\Models\UserEntry;
use Livewire\Component;

class FilterUserEntriesBrowser extends Component
{
    public ?Franchise $franchise = null;

    public bool $includeAllFranchises = false;
    public bool $includeAlreadyWatched = false;

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
                $userEntry = UserEntry::inRandomOrder()->where('user_id', $user->id)->where('rating', null)->first();
            }
            $this->franchise = $userEntry->entry->franchise;
        } else {
            if($this->includeAlreadyWatched)
            {
                $this->franchise = Franchise::inRandomOrder()->has('entries')->first();
            } else 
            {
                $this->franchise = Entry::inRandomOrder()->whereDoesntHave('userEntries', function ($query) use ($user) {
                    $query->where('user_id', $user->id)->where('rating', '!=', null);
                })->first()->franchise;
            }
        }
    }

    public function render()
    {
        $user = auth()->user();
        return view('livewire.dashboard.filter-user-entries-browser', [
            'franchise' => $this->franchise,
            'canGetRandom' => count(UserEntry::where('user_id', $user->id)->where('rating', null)->get()) >= 1,
            'includeAllFranchises' => $this->includeAllFranchises,
            'includeAlreadyWatched' => $this->includeAlreadyWatched
        ]);
    }
}
