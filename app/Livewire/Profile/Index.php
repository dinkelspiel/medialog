<?php

namespace App\Livewire\Profile;

use App\Enums\UserRatingStyleEnum;
use App\Enums\UserSubtextStyleEnum;
use App\Models\ColorScheme;
use App\Models\User;
use App\Models\UserColorScheme;
use App\Models\UserFollow;
use Livewire\Component;

class Index extends Component
{
    public User $user;

    public function toggleFollow()
    {
        if (!auth()->check()) {
            return;
        }

        if (auth()->user()->id == $this->user->id) {
            return;
        }

        $follow = UserFollow::where("user_id", auth()->user()->id)
            ->where("follow_id", $this->user->id)
            ->first();

        if (is_null($follow)) {
            UserFollow::create([
                "user_id" => auth()->user()->id,
                "follow_id" => $this->user->id,
                "is_following" => true,
            ]);
        } else {
            $follow->is_following = !$follow->is_following;
            $follow->save();
        }
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
