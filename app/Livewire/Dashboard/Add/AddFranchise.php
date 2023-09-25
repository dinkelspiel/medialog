<?php

namespace App\Livewire\Dashboard\Add;

use App\Models\Category;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\Studio;
use Livewire\Component;

class AddFranchise extends Component
{
    public string $franchiseName = "";
    public string $franchiseCategory = "";

    public function mount()
    {
        $this->franchiseCategory = Category::first()->name;
    }

    public function render()
    {
        $studios = Studio::all();
        $studios->sort();

        return view('livewire.dashboard.add.add-franchise');
    }

    public function addEntry()
    {
        $this->franchise->entries->push(Entry::create([
            'franchise_id' => $this->franchise->id,
            'name' => '',
            'studio_id' => 1,
            'cover_url' => ''
        ]));
    }

    public function removeEntry()
    {
        array_shift($this->entries);
    }
}
