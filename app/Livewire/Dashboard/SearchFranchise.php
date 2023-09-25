<?php

namespace App\Livewire\Dashboard;

use App\Models\Entry;
use App\Models\Franchise;
use Illuminate\Support\Facades\Validator;
use Livewire\Component;

class SearchFranchise extends Component
{
    public $search = '';

    public function create(int $franchiseId, int $entryId)
    {
        $user = auth()->user();

        $validator = Validator::make([
            'franchise_id' => $franchiseId,
            'entry_id' => $entryId
        ], [
            'franchise_id' => 'required|numeric',
            'entry_id' => 'required|numeric'
        ]);

        if($validator->fails())
        {
            session()->flash("error", "Invalid input");
        }

        $userEntry = \App\Models\UserEntry::where('entry_id', $entryId)
            ->where('user_id', $user->id)
            ->first();

        if($userEntry)
        {
            session()->flash("error", "An entry of this id already exists for user");
        }

        $userEntry = new \App\Models\UserEntry;
        $userEntry->rating = 0;
        $userEntry->notes = "";
        $userEntry->user_id = $user->id;
        $userEntry->entry_id = $entryId;
        $userEntry->save();

        $userEntry->refresh();
        $this->dispatch('refreshUserEntries');
    }

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
            'entries' => $entriesWithoutUserEntry
        ]);
    }
}
