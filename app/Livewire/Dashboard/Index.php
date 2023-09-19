<?php

namespace App\Livewire\Dashboard;

use Livewire\Component;

class Index extends Component
{
    public $showUserEntry = false;
    public $userEntryId = 0;

    protected $listeners = ['showUserEntry' => 'displayUserEntry', 
        'closeUserEntry' => 'closeUserEntry'
    ];


    public function displayUserEntry(int $userEntryId)
    {
        $this->showUserEntry = false;
        $this->userEntryId = $userEntryId;
    
        $this->showUserEntry = true;
    }

    public function closeUserEntry()
    {
        $this->showUserEntry = false;
    }

    public function render()
    {
        return view('livewire.dashboard.index', [
            'showUserEntry' => $this->showUserEntry
        ])->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
