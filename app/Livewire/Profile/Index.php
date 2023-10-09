<?php

namespace App\Livewire\Profile;

use App\Enums\UserRatingStyleEnum;
use App\Models\User;
use Livewire\Component;

class Index extends Component
{
    public $ratingStyle;

    public function setRatingStyle(string $ratingStyle)
    {
        $user = User::where('id', auth()->user()->id)->first();
        if($ratingStyle == "range")
        {
            $user->rating_style = "range";
            $this->ratingStyle = "b";
        } else {
            $user->rating_style = "stars";
            $this->ratingStyle = "c";
        }
        $user->save();
        $this->ratingStyle = $user;
    }

    public function logout()
    {
        auth()->logout();

        return redirect('/login');
    }

    public function render()
    {
        $this->ratingStyle = auth()->user()->rating_style->value;

        return view('livewire.profile.index', [
            'ratingStyle' => $this->ratingStyle
        ])->layout('layouts.app', [
            'header' => 'profile'
        ]);
    }
}
