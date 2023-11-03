<?php

namespace App\Livewire\Profile;

use App\Enums\UserRatingStyleEnum;
use App\Enums\UserSubtextStyleEnum;
use App\Models\ColorScheme;
use App\Models\User;
use App\Models\UserColorScheme;
use Livewire\Component;

class Index extends Component
{
    public function mount()
    {
        $this->ratingStyle = auth()->user()->rating_style->value;
        $this->subtextStyle = auth()->user()->subtext_style->value;

        if (auth()->user()->colorScheme) {
            $this->colorSchemeName = auth()->user()->colorScheme->name;

            $this->background = auth()->user()->colorScheme->background;
            $this->card = auth()->user()->colorScheme->card;
            $this->cardHover = auth()->user()->colorScheme->card_hover;
            $this->cardActive = auth()->user()->colorScheme->card_active;
            $this->secondary = auth()->user()->colorScheme->secondary;
            $this->secondaryHover = auth()->user()->colorScheme->secondary_hover;
            $this->secondaryActive = auth()->user()->colorScheme->secondary_active;
            $this->outline = auth()->user()->colorScheme->outline;
            $this->text = auth()->user()->colorScheme->text;
            $this->textGray = auth()->user()->colorScheme->text_gray;
        }
    }

    public $ratingStyle;

    public function setRatingStyle(string $ratingStyle)
    {
        $user = User::where("id", auth()->user()->id)->first();
        if ($ratingStyle == "range") {
            $user->rating_style = "range";
        } else {
            $user->rating_style = "stars";
        }
        $user->save();
    }

    public $subtextStyle;

    public function setSubtextStyle(string $subtextStyle)
    {
        $user = User::where("id", auth()->user()->id)->first();
        if ($subtextStyle == "studio") {
            $user->subtext_style = UserSubtextStyleEnum::Studio;
        } else {
            $user->subtext_style = UserSubtextStyleEnum::Creator;
        }
        $user->save();
    }

    public string $background,
        $card,
        $cardHover,
        $cardActive,
        $secondary,
        $secondaryHover,
        $secondaryActive,
        $outline,
        $text,
        $textGray;
    public string $colorSchemeName = "";

    public function logout()
    {
        auth()->logout();

        return redirect("/login");
    }

    public function createCustomColorScheme()
    {
        $colorScheme = new ColorScheme();
        $colorScheme->name = auth()->user()->username . "'s Color Scheme";
        $colorScheme->creator_id = auth()->user()->id;
        $colorScheme->created_at = now();
        $colorScheme->save();

        $userColorScheme = new UserColorScheme();
        $userColorScheme->user_id = auth()->user()->id;
        $userColorScheme->color_scheme_id = $colorScheme->id;
        $userColorScheme->save();
    }

    public function saveColorScheme()
    {
        $this->validate([
            "colorSchemeName" => "required",
            "background" => 'required|regex:/^#([a-fA-F0-9]{6})$/',
            "card" => 'required|regex:/^#([a-fA-F0-9]{6})$/',
            "cardHover" => 'required|regex:/^#([a-fA-F0-9]{6})$/',
            "cardActive" => 'required|regex:/^#([a-fA-F0-9]{6})$/',
            "secondary" => 'required|regex:/^#([a-fA-F0-9]{6})$/',
            "secondaryHover" => 'required|regex:/^#([a-fA-F0-9]{6})$/',
            "secondaryActive" => 'required|regex:/^#([a-fA-F0-9]{6})$/',
            "outline" => 'required|regex:/^#([a-fA-F0-9]{6})$/',
            "text" => 'required|regex:/^#([a-fA-F0-9]{6})$/',
            "textGray" => 'required|regex:/^#([a-fA-F0-9]{6})$/',
        ]);

        if (auth()->user()->colorScheme->creator_id == auth()->user()->id) {
            $colorScheme = ColorScheme::find(auth()->user()->colorScheme->id);
            if (
                ColorScheme::where("name", $this->colorSchemeName)->exists() &&
                ColorScheme::where("name", $this->colorSchemeName)->first()
                    ->id != auth()->user()->colorScheme->id
            ) {
                return;
            } else {
                $colorScheme->name = $this->colorSchemeName;
            }
        } else {
            $colorScheme = new ColorScheme();
            $colorScheme->name =
                auth()->user()->username . "'s " . $this->colorSchemeName;
            $colorScheme->creator_id = auth()->user()->id;
        }
        $colorScheme->background = $this->background;
        $colorScheme->card = $this->card;
        $colorScheme->card_hover = $this->cardHover;
        $colorScheme->card_active = $this->cardActive;
        $colorScheme->secondary = $this->secondary;
        $colorScheme->secondary_hover = $this->secondaryHover;
        $colorScheme->secondary_active = $this->secondaryActive;
        $colorScheme->outline = $this->outline;
        $colorScheme->text = $this->text;
        $colorScheme->text_gray = $this->textGray;
        $colorScheme->save();

        auth()->user()->userColorScheme->color_scheme_id = $colorScheme->id;
        auth()
            ->user()
            ->userColorScheme->save();

        $this->redirect("/profile");
    }

    public function render()
    {
        return view("livewire.profile.index", [
            "ratingStyle" => $this->ratingStyle,
        ])->layout("layouts.app", [
            "header" => "profile",
        ]);
    }
}
