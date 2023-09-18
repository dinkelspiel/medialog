<?php

namespace App\Livewire\Dashboard;

use Livewire\Component;

class Index extends Component
{
    public $showUserEntry = false;
    public $showAddEntry = false;
    public $showAddStudio = false;
    public $userEntryId = 0;

    protected $listeners = ['showUserEntry' => 'displayUserEntry', 
    'closeUserEntry' => 'closeUserEntry',
    'openAddEntry' => 'openAddEntry',
    'openAddStudio' => 'openAddStudio',
    'closeAddStudio' => 'closeAddStudio'];

    public function openAddEntry()
    {
        $this->showAddEntry = true;
    }

    public function openAddStudio()
    {
        $this->showAddEntry = false;
        $this->showAddStudio = true;
    }

    public function closeAddStudio()
    {
        $this->showAddEntry = true;
        $this->showAddStudio = false;
    }

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
            'showUserEntry' => $this->showUserEntry,
            'showAddEntry' => $this->showAddEntry,
            'showAddStudio' => $this->showAddStudio
        ])->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
