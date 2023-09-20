<?php

namespace App\Livewire\Dashboard\Add;

use App\Models\Entry;
use Illuminate\Database\Eloquent\Collection;
use Livewire\Component;

class AddEntry extends Component
{
    public $entry;

    public function render()
    {
        return view('livewire.dashboard.add.add-entry');
    }
}
