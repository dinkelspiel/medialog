<?php

namespace App\Livewire;

use Livewire\Component;

class Dashboard extends Component
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
        return view('livewire.dashboard', [
            'showUserEntry' => $this->showUserEntry,
            'showAddEntry' => $this->showAddEntry,
            'showAddStudio' => $this->showAddStudio
        ]);
    }
}
