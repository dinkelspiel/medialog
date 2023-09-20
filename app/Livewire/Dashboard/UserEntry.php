<?php

namespace App\Livewire\Dashboard;

use Illuminate\Support\Facades\Validator;
use Livewire\Component;

class UserEntry extends Component
{
    public $userEntryId;

    public $userEntry;

    public function closeUserEntry()
    {
        $this->dispatch('closeUserEntry');
    }

    public function update()
    {
        $user = auth()->user();

        $validator = Validator::make([
            'rating' => $this->userEntry->rating,
            'notes' => $this->userEntry->notes,
            'id' => $this->userEntry->id
        ], [
            'rating' => 'required|numeric',
            'notes' => '',
            'id' => 'required|numeric'
        ]);

        if($validator->fails())
        {
            session()->flash("error", "Invalid input");
        }

        if($user->id != $this->userEntry->user_id)
        {
            session()->flash("error", "You cannot edit a user entry that is not yours");
        }

        $this->userEntry->save();

        session()->flash('message', 'Updated successful!');
    }

    public function render()
    {
        $userId = auth()->user()->id;

        $this->userEntry = \App\Models\UserEntry::where('id', $this->userEntryId)->first();

        if(!isset($this->userEntry))
        {
            return view('livewire.dashboard.user-entry', [
                'error' => "No user entry with id"
            ]);
        }

        if($userId != $this->userEntry->user_id)
        {
            return view('livewire.dashboard.user-entry', [
                'error' => "User ids do not match. Loading user entry failed!"
            ]);
        }

        return view('livewire.dashboard.user-entry', [
            'userEntry' => $this->userEntry
        ]);
    }
}
