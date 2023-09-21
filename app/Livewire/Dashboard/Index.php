<?php

namespace App\Livewire\Dashboard;

use App\Models\UserEntry;
use Livewire\Component;

class Index extends Component
{
    public $listeners = ['refreshUserEntries' => '$refresh'];

    public ?UserEntry $userEntry = null;

    public function showUserEntry($id)
    {
        $this->userEntry = UserEntry::where('id', $id)->where('user_id', auth()->user()->id)->first();
    }

    public function render()
    {
        return view('livewire.dashboard.index', [
            'userEntry' => $this->userEntry,
            'userEntries' => UserEntry::where('user_id', auth()->user()->id)->get()
        ])->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
