<?php

namespace App\Livewire\Dashboard;

use App\Models\Category;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\Person;
use Illuminate\Support\Facades\Validator;
use Livewire\Component;

class SearchFranchise extends Component
{
    public $search = '';
    public $studio = '0';
    public $category = '0';
    public $creator = '0';

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
            if($searchString != "*" && $searchString != "")
            {
                $query->where('franchises.name', 'LIKE', '%' . $searchString . '%');
            }
        })
        ->whereDoesntHave('userEntries', function ($query) use ($userId) {
            $query->where('user_entries.user_id', $userId);
        });

        $creator = $this->creator;
        $category = $this->category;

        if($this->studio != "0")
        {
            $entriesWithoutUserEntry->where('entries.studio_id', $this->studio);
        }
        if($this->creator != "0")
        {
            $entriesWithoutUserEntry->whereHas('creators', function($q) use ($creator) {
                $q->where('people.id', $creator);
            });
        }
        if($this->category != "0")
        {
            $entriesWithoutUserEntry->whereHas('franchise', function($q) use ($category) {
                $q->where('franchises.category_id', $category);
            });
        }

        $entriesWithoutUserEntry = $entriesWithoutUserEntry->get();

        return view('livewire.dashboard.search-franchise', [
            'uid' => $userId,
            'entries' => $entriesWithoutUserEntry,
            'searchStudio' => $this->studio,
            'searchCreator' => $this->creator,
            'searchCategory' => $this->category
        ]);
    }
}
