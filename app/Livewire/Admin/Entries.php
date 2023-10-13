<?php

namespace App\Livewire\Admin;

use Livewire\Component;

class Entries extends Component
{
    public function render()
    {
        return view("livewire.admin.entries")->layout("layouts.app", [
            "header" => "admin",
        ]);
    }
}
