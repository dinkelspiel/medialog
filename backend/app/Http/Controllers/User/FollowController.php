<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserFollow;
use App\Models\UserSession;
use Illuminate\Http\Request;

class FollowController extends Controller
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
    public function store(Request $request, User $user, $follow)
    {
        $follow = User::findModelStatically($follow);

        if(UserSession::where('session', $request->input('sessionToken'))->first()->user->id != $user->id)
        {
            return response()->json(['error' => 'You do not have permission to add follows for this user'], 401);
        }

        if($user->id === $follow->id)
        {
            return response()->json(['error' => 'You cannot follow yourself'], 400);
        }

        if(!UserFollow::where('user_id', $user->id)->where('follow_id', $follow->id)->exists())
        {
            UserFollow::create([
                'user_id' => $user->id,
                'follow_id' => $follow->id,
                'is_following' => true
            ]);
        } else {
            UserFollow::where('user_id', $user->id)->where('follow_id', $follow->id)->update([
                'is_following' => true
            ]);
        }

        return response()->json([
            'message' => 'Successfully created follow link'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserFollow $userFollow)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserFollow $userFollow)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user, $follow)
    {
        $follow = User::findModelStatically($follow);

        if(UserSession::where('session', $request->input('sessionToken'))->first()->user->id != $user->id)
        {
            return response()->json(['error' => 'You do not have permission to remove follows for this user'], 401);
        }

        if($user->id === $follow->id)
        {
            return response()->json(['error' => 'You cannot follow yourself'], 400);
        }

        if(UserFollow::where('user_id', $user->id)->where('follow_id', $follow->id)->exists())
        {
            UserFollow::where('user_id', $user->id)->where('follow_id', $follow->id)->update([
                'is_following' => false
            ]);
        }

        return response()->json([
            'message' => 'Successfully deleted follow link'
        ]);
    }
}
