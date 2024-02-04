<?php

namespace App\Http\Controllers;

use App\Http\Controllers\User\UserController;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
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
                "sessionToken" => $token,
            ]);
        }

        return response()->json(["error" => "Invalid credentials"], 401);
    }

    public function validateSession(Request $request): JsonResponse
    {
        $session = UserSession::where('session', $request->get('sessionToken'))->first();

        return (new UserController)->show($session->user);
    }
}
