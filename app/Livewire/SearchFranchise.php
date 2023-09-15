<?php

namespace App\Livewire;

use App\Models\Franchise;
use Livewire\Component;

class SearchFranchise extends Component
{
    public $search = '';

    public function render()
    {
        return view('livewire.search-franchise', [
            'franchises' => Franchise::where('name', 'like', '%' . $this->search . '%')->get(),
        ]);
    }
}
