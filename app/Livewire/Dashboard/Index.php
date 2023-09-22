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

    public function markAsComplete(int $entryId)
    {
        $user = auth()->user();

        $userEntry = UserEntry::where('id', $entryId)->where('user_id', $user->id)->first();

        if(is_null($userEntry))
        {
            return "No valid user entry found";
        }

        $userEntry->rating = 0;
        $userEntry->save();

        $this->userEntry = $userEntry;
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
