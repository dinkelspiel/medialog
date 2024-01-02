<?php

namespace App\Livewire\Community;

use App\Models\UserFollow;
use Livewire\Component;

class FriendSearch extends Component
{
    public string $query = "";

    public function toggleFollow($followId)
    {
        UserFollow::toggleFollow(auth()->user()->id, $followId);
    }

    public function render()
    {
        return view("livewire.community.friend-search")->layout("layouts.app", [
            "header" => "profile",
        ]);
    }
}
