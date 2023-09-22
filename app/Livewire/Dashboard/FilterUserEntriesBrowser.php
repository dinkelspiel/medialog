<?php

namespace App\Livewire\Dashboard;

use App\Models\Franchise;
use App\Models\UserEntry;
use Livewire\Component;

class FilterUserEntriesBrowser extends Component
{
    public ?Franchise $franchise = null;

    public function getRandom()
    {
        $user = auth()->user();
        $userEntry = UserEntry::inRandomOrder()->where('user_id', $user->id)->where('rating', null)->first();
        $this->franchise = $userEntry->entry->franchise;
    }

    public function render()
    {
        $user = auth()->user();
        return view('livewire.dashboard.filter-user-entries-browser', [
            'franchise' => $this->franchise,
            'canGetRandom' => count(UserEntry::where('user_id', $user->id)->where('rating', null)->get()) >= 1
        ]);
    }
}
