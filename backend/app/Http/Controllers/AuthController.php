<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        if (!User::where("email", $request->json("email"))->exists()) {
            return response()->json(
                ["error" => "User with this email doesn't exist"],
                401,
            );
        }

        if (Auth::attempt($request->only("email", "password"))) {
            $user = Auth::user();
            $token = Str::random(64);

            UserSession::create([
                "session" => $token,
                "user_id" => $user->id,
            ]);

            return response()->json([
                "user" => $user->only("username", "email"),
                "session_token" => $token,
            ]);
        }

        return response()->json(["error" => "Invalid credentials"], 401);
    }
}
