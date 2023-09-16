<?php

namespace App\Livewire;

use Livewire\Component;

class UserEntry extends Component
{
    public $userEntryId;

    public function closeUserEntry()
    {
        $this->dispatch('closeUserEntry');
    }

    public function render()
    {
        $userId = session('id');

        $userEntry = \App\Models\UserEntry::where('id', $this->userEntryId)->first();

        if(!isset($userEntry))
        {
            return view('livewire.user-entry', [
                'error' => "No user entry with id"
            ]);
        }

        if($userId != $userEntry->user_id)
        {
            return view('livewire.user-entry', [
                'error' => "User ids do not match. Loading user entry failed!"
            ]);
        }

        return view('livewire.user-entry', [
            'userEntry' => $userEntry
        ]);
    }
}
