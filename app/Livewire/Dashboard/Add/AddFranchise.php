<?php

namespace App\Livewire\Dashboard\Add;

use App\Models\Category;
use App\Models\Franchise;
use App\Models\Studio;
use Livewire\Component;

class AddFranchise extends Component
{
    public $listeners = ['refreshEntries' => '$refresh'];
    
    public Franchise $franchise;

    public function mount()
    {
        $this->franchise = Franchise::create([
            'name' => '',
            'category_id' => 0
        ]);
    }
    
    public function render()
    {
        $studios = Studio::all();
        $studios->sort();

        return view('livewire.dashboard.add.add-franchise', [
            'entries' => $this->franchise->entries,
            'studios' => $studios,
            'categories' => Category::all()
        ])->layout('layouts.app', [ 
            'header' => 'dashboard'
        ]);
    }

    public function addEntry()
    {
        $this->franchise->entries->create([
            'name' => 'asd',
            'studio_id' => 1,
            'cover_url' => ''
        ]);
    }

    public function removeEntry()
    {
        array_shift($this->entries);
    }
}
