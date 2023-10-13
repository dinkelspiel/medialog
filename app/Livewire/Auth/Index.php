<?php

namespace App\Livewire\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Livewire\Component;

class Index extends Component
{
    public $regEmail, $regPassword, $regUsername;
    public $logEmail, $logPassword;

    public $username, $email, $password;

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
        $user->save();

        session()->flash("message", "Registration Successful.");
    }

    public function login()
    {
        $this->email = $this->logEmail;
        $this->password = $this->logPassword;

        $credentials = $this->validate([
            "email" => "required|email",
            "password" => "required",
        ]);

        if (auth()->attempt($credentials)) {
            $this->redirect("/dashboard");
        } else {
            session()->flash("error", "Invalid credentials");
        }
    }

    public function render()
    {
        if (auth()->check()) {
            $this->redirect("/dashboard");
        }

        return view("livewire.auth.index")->layout("layouts.app", [
            "header" => "home",
        ]);
    }
}
