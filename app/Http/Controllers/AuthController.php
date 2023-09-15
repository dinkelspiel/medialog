<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        session_start();

        if(isset($_SESSION['id']))
        {
            return redirect('/dashboard');
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect('/login')->withErrors($validator)->onlyInput('email');
        }

        $email = $request->input('email');
        $password = $request->input('password');

        $user = User::where('email', $email)->first();

        if(!($user && Hash::check($password, $user->password)))
        {
            return redirect('/login')->withErrors(['email_or_password' => 'The email or password is incorrect.'])->onlyInput('email');
        }


        $_SESSION['id'] = $user->id;
        $_SESSION['username'] = $user->username;
        $_SESSION['email'] = $user->email;

        return redirect('/dashboard');
    }
}
