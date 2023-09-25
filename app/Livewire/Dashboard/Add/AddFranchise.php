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

    public array $entries = [];

    public function addEntry()
    {
        $this->entries[] = ['name' => '', 'studio_id' => '1', 'cover_url' => '', 'producers' => []];
    }

    public function removeEntry(int $index)
    {
        unset($this->entries[$index]);
        $this->entries = array_values($this->entries);
    }

    public function addProducer(int $entryId, string $person)
    {
        array_push($this->entries[$entryId]['producers'], $person);
    }

    public function removeProducer(int $entryId, string $person)
    {
        array_push($this->entries[$entryId]['producers'], $person);
    }

    public function save()
    {
        $franchise = Franchise::create(['name' => $this->franchiseName, 'category_id' => Category::where('name', $this->franchiseCategory)->id]);

        foreach($this->entries as $entry)
        {
            $entry->franchise_id = $franchise->id;
            $franchise->addEntry(new Entry($entry));
        }

        return redirect('/dashboard');
    }

    public function mount()
    {
        $this->franchiseCategory = Category::first()->name;
    }

    public function render()
    {
        $studios = Studio::all();
        $studios->sort();

        return view('livewire.dashboard.add.add-franchise')->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
