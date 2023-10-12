<?php

namespace App\Livewire\Profile;

use App\Enums\UserRatingStyleEnum;
use App\Enums\UserSubtextStyleEnum;
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
        } else {
            $user->rating_style = "stars";
        }
        $user->save();
    }

    public $subtextStyle;

    public function setSubtextStyle(string $subtextStyle)
    {
        $user = User::where('id', auth()->user()->id)->first();
        if($subtextStyle == "studio")
        {
            $user->subtext_style = UserSubtextStyleEnum::Studio;
        } else {
            $user->subtext_style = UserSubtextStyleEnum::Creator;
        }
        $user->save();
    }

    public function logout()
    {
        auth()->logout();

        return redirect('/login');
    }

    public function render()
    {
        $this->ratingStyle = auth()->user()->rating_style->value;
        $this->subtextStyle = auth()->user()->subtext_style->value;

        return view('livewire.profile.index', [
            'ratingStyle' => $this->ratingStyle
        ])->layout('layouts.app', [
            'header' => 'profile'
        ]);
    }
}
