<?php

namespace App\Livewire;

use App\Models\Entry;
use App\Models\Franchise;
use Livewire\Component;

class SearchFranchise extends Component
{
    public $search = '';

    public function render()
    {
        $searchString = $this->search;
        $userId = request()->session()->get('id');

        $entriesWithoutUserEntry = Entry::whereHas('franchise', function ($query) use ($searchString) {
            $query->where('name', 'LIKE', '%' . $searchString . '%');
        })
        ->whereDoesntHave('userEntries', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        return view('livewire.search-franchise', [
            'uid' => $userId,
            'entries' => $entriesWithoutUserEntry,
        ]);
    }
}
