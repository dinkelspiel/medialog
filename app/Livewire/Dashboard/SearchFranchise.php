<?php

namespace App\Livewire\Dashboard;

use App\Models\Category;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\Person;
use App\Models\Studio;
use Illuminate\Support\Facades\Validator;
use Livewire\Component;

class SearchFranchise extends Component
{
    public $search = '';
    public $category = '0';

    public $searchStudio = '';
    public $searchCreator = '';

    public function setSearchStudio(string $studioName)
    {
        $this->searchStudio = $studioName;
    }

    public function setSearchCreator(string $creator)
    {
        $this->searchCreator = $creator;
    }

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

        $creator = Person::where('name', $this->searchCreator)->first()->id ?? "0";
        $studio = Studio::where('name', $this->searchStudio)->first()->id ?? "0";
        $category = $this->category;

        if($studio != "0")
        {
            $entriesWithoutUserEntry->whereHas('studios', function($q) use ($studio) {
                $q->where('studios.id', $studio);
            });        }
        if($creator != "0")
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
            'searchCategory' => $this->category
        ]);
    }
}
