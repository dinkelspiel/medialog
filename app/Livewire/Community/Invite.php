<?php

namespace App\Livewire\Community;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Livewire\Component;

class Invite extends Component
{
    public $regEmail, $regPassword, $regUsername;
    public $username, $email, $password;

    public User $user;

    public function mount(int $userId)
    {
        $this->user = User::where("id", $userId)->first();

        if (auth()->check()) {
            $this->redirect("/dashboard");
        }
    }

    public function register()
    {
        $this->username = $this->regUsername;
        $this->email = $this->regEmail;
        $this->password = $this->regPassword;

        $this->validate([
            "username" => "required|unique:users",
            "email" => "required|email|unique:users",
            "password" => "required|min:6",
        ]);

        $user = new User();
        $user->username = $this->username;
        $user->email = $this->email;
        $user->password = Hash::make($this->password);
        $user->invited_by = $this->user->id;
        $user->save();

        session()->flash("message", "Registration Successful.");

        Auth::loginUsingId($user->id, true);
        $this->redirect("/dashboard");
    }

    public function render()
    {
        return view("livewire.community.invite")->layout("layouts.app", [
            "header" => "home",
        ]);
    }
}
