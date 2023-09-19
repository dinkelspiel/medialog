<?php

namespace App\Livewire\Dashboard\Add;

use App\Models\Category;
use App\Models\Studio;
use App\Models\Franchise;
use Livewire\Component;

class AddFranchise extends Component
{
    public $listeners = ['refreshEntries' => '$refresh'];
    
    public Franchise $franchise;
    
    public function mount() {
        $this->franchise = new Franchise;
    }



    public function render()
    {
        $studios = Studio::all();
        $studios->sort();

        return view('livewire.dashboard.add.franchise', [
            'entries' => $this->entries,
            'studios' => $studios,
            'categories' => Category::all()
        ]);
    }

    public function addEntry()
    {
        array_push($this->entries, [
            'studioSearch' => "",
            'studios' => ""
        ]);
    }

    public function removeEntry()
    {
        array_shift($this->entries);
    }
}
