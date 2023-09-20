<?php

namespace App\Livewire\Dashboard;

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
        return view('livewire.dashboard.user-entries-browser', [
            'userEntries' => UserEntry::where('user_id', auth()->user()->id)->get(),
        ]);
    }
}
