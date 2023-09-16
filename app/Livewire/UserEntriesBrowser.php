<?php

namespace App\Livewire;

use App\Models\UserEntry;
use Livewire\Component;

class UserEntriesBrowser extends Component
{
    public function showUserEntry($userEntryId)
    {
        $this->dispatch('showUserEntry', $userEntryId);
    }

    public function render()
    {
        return view('livewire.user-entries-browser', [
            'userEntries' => UserEntry::where('user_id', request()->session()->get('id'))->get(),
        ]);
    }
}
