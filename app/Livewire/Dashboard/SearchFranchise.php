<?php

namespace App\Livewire\Dashboard;

use App\Models\Entry;
use App\Models\Franchise;
use Livewire\Component;

class SearchFranchise extends Component
{
    public $search = '';

    public function render()
    {
        $searchString = $this->search;
        $userId = auth()->user()->id;

        $entriesWithoutUserEntry = Entry::whereHas('franchise', function ($query) use ($searchString) {
            $query->where('name', 'LIKE', '%' . $searchString . '%');
        })
        ->whereDoesntHave('userEntries', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        return view('livewire.dashboard.search-franchise', [
            'uid' => $userId,
            'entries' => $entriesWithoutUserEntry,
        ]);
    }
}
