<?php

namespace App\Livewire\Dashboard;

use Livewire\Component;

class Add extends Component
{
    public $page = "add";

    public function setPage(string $page)
    {   
        $this->page = $page;
    }

    public function render()
    {
        return view('livewire.dashboard.add', [
            'page' => $this->page
        ]);
    }
}
