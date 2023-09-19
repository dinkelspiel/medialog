<?php

namespace App\Http\Controllers;

use App\Models\UserEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserEntryController extends Controller
{
    public function create(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'franchise_id' => 'required|numeric',
            'entry_id' => 'required|numeric'
        ]);

        if($validator->fails())
        {
            return "Invalid input";
        }

        $franchiseId = $request->input('franchise_id');
        $entryId = $request->input('entry_id');

        $userEntry = UserEntry::where('entry_id', $entryId)
            ->where('user_id', $user->id)
            ->first();

        if($userEntry)
        {
            return "An entry of this id already exists for user ";
        }

        $userEntry = new UserEntry;
        $userEntry->rating = null;
        $userEntry->notes = "";
        $userEntry->user_id = $user->id;
        $userEntry->entry_id = $entryId;
        $userEntry->save();

        return redirect('/dashboard');
    }

    public function update(Request $request)
    {
        $user = $request->attributes->get('user');

        $validator = Validator::make($request->all(), [
            'rating' => 'required|numeric',
            'notes' => 'required',
            'id' => 'required|numeric'
        ]);

        if($validator->fails())
        {
            return "Invalid input";
        }

        $rating = $request->input('rating');
        $notes = $request->input('notes');
        $id = $request->input('id');
        
        $userEntry = UserEntry::where('id', $id)->first();

        if(is_null($userEntry))
        {
            return "Invalid user entry id";
        }

        if($user->id != $userEntry->user_id)
        {
            return "You cannot edit a user entry that is not yours";
        }

        $userEntry->rating = $rating;
        $userEntry->notes = $notes;
        $userEntry->save();

        return redirect('/dashboard');
    }
}
