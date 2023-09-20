<?php

namespace App\Livewire\Profile;

use Livewire\Component;

class Index extends Component
{
    public function logout()
    {
        auth()->logout();

        return redirect('/login');
    }

    public function render()
    {
        return view('livewire.profile.index')->layout('layouts.app', [
            'header' => 'profile'
        ]);
    }
}
