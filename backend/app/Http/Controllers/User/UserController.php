<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        if(User::where('email', $request->email)->exists())
        {
            return response()->json(["error" => "User already exists with email address"], 401);
        }

        if(User::where('username', $request->username)->exists())
        {
            return response()->json(["error" => "User already exists with username"], 401);
        }

        $request->validate([
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required'
        ]);

        User::create([
            'username' => $request->json('username'),
            'email' => $request->json('email'),
            'password' => Hash::make($request->json('password'))
        ]);

        $auth = new AuthController;
        return $auth->login($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): JsonResponse
    {
        $data = $user->only('id', 'username', 'email', 'rating_style');
        $data['ratingStyle'] = $data['rating_style'];
        unset($data['rating_style']);
        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        if(UserSession::where('session', $request->get('sessionToken'))->first()->user->id != $user->id)
        {
            return response()->json(['error' => 'You do not have permission to update this user'], 401);
        }

        if($request->json('ratingStyle') !== null)
        {
            $request->validate([
                'ratingStyle' => 'required|in:stars,range'
            ]);
            $user->rating_style = $request->json('ratingStyle');
        }

        $user->save();
        return response()->json(['message' => 'Successfully saved user'], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
