<?php

namespace App\Livewire;

use Livewire\Component;

class Dashboard extends Component
{
    public $showUserEntry = false;
    public $userEntryId = 0;

    protected $listeners = ['showUserEntry' => 'displayUserEntry', 'closeUserEntry' => 'closeUserEntry'];

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
            'showUserEntry' => $this->showUserEntry
        ]);
    }
}
