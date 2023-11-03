<?php

namespace App\Livewire;

use App\Models\ColorScheme;
use App\Models\UserColorScheme;
use Livewire\Component;

class ColorSchemes extends Component
{
    public function pickColorScheme(int $colorSchemeId)
    {
        $colorScheme = ColorScheme::find($colorSchemeId);

        if (
            auth()->user()->colorScheme &&
            auth()->user()->colorScheme->id == $colorScheme->id
        ) {
            auth()
                ->user()
                ->userColorScheme->delete();
        } elseif (auth()->user()->userColorScheme) {
            auth()->user()->userColorScheme->color_scheme_id = $colorSchemeId;
            auth()
                ->user()
                ->userColorScheme->save();
        } else {
            $userColorScheme = new UserColorScheme();
            $userColorScheme->user_id = auth()->user()->id;
            $userColorScheme->color_scheme_id = $colorScheme->id;
            $userColorScheme->save();
        }

        $this->redirect("/color-schemes");
    }

    public function render()
    {
        return view("livewire.color-schemes")->layout("layouts.app", [
            "header" => "profile",
        ]);
    }
}
