<?php

namespace App\Livewire\Profile;

use App\Enums\UserRatingStyleEnum;
use App\Enums\UserSubtextStyleEnum;
use App\Models\ColorScheme;
use App\Models\User;
use App\Models\UserColorScheme;
use App\Models\UserFollow;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Index extends Component
{
    public User $user;

    public function logout()
    {
        Auth::logout();
    }

    public function toggleFollow()
    {
        if (!auth()->check()) {
            return;
        }

        UserFollow::toggleFollow(auth()->user()->id, $this->user->id);
    }

    public function mount(int $userId)
    {
        $this->user = User::where("id", $userId)->first();
    }

    public function render()
    {
        return view("livewire.profile.index")->layout("layouts.app", [
            "header" => "profile",
        ]);
    }
}
