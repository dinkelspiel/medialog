<?php

namespace App\Livewire\Auth;

use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Livewire\Component;

class Index extends Component
{
    public $email, $password, $username;

    public function register()
    {
        $validatedData = $this->validate([
            'username' => 'requird:unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        $validatedData['password'] = Hash::make($this->password);
        User::create($validatedData);

        session()->flash('message', 'Registration Successful.');
    }
    
    public function login()
    {
        $credentials = $this->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if(auth()->attempt($credentials)) {
            return redirect('/dashboard');
        } else {
            session()->flash('error', 'Invalid credentials');
        }
    }

    public function render()
    {
        if(auth()->check())
        {
            return redirect('/dashboard');
        }

        return view('livewire.auth.index')->layout('layouts.app', [
            'header' => 'home'
        ]);
    }
}
