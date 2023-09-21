<?php

namespace App\Http\Controllers;

use App\Models\UserEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserEntryController extends Controller
{
    public function update(Request $request, int $entryId)
    {
        $user = auth()->user();
        $userEntry = UserEntry::where('id', $entryId)->where('user_id', $user->id)->first();

        if(is_null($userEntry))
        {
            return "You cannot edit a user entry that is not yours.";
        }

        $validator = Validator::make($request->all(['rating', 'notes', 'entry_id']), [
            'rating' => 'required|numeric',
            'notes' => '',
            'entry_id' => 'required|numeric'
        ]);

        if($validator->fails())
        {
            return 'The given input was invalid.' . $validator->errors();
        }

        $userEntry->rating = $request->input('rating');
        $userEntry->notes = $request->input('notes');

        $userEntry->save();

        return redirect('/dashboard');
    }

    public function delete(Request $request, int $entryId)
    {
        $user = auth()->user();

        UserEntry::where('id', $entryId)->where('user_id', $user->id)->delete();

        return redirect('/dashboard');
    }

    public function read(Request $request, int $entryId)
    {
        $user = auth()->user();

        $userEntry = UserEntry::where('id', $entryId)->where('user_id', $user->id)->first();

        if(is_null($userEntry))
        {
            return "No valid user entry found";
        }

        $userEntry->rating = 0;
        $userEntry->save();

        return redirect('/dashboard');
    }
}
