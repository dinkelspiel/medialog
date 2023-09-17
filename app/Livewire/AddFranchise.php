<?php

namespace App\Livewire;

use App\Models\Category;
use App\Models\Studio;
use Livewire\Component;
use LivewireUI\Modal\ModalComponent;

class AddFranchise extends ModalComponent
{
    public $listeners = ['refreshEntries' => '$refresh'];
    
    public $entries = [];

    public function render()
    {
        $studios = Studio::all();
        $studios->sort();

        return view('livewire.add-franchise', [
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
