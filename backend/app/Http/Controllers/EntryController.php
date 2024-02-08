<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use App\Models\Franchise;
use App\Models\UserSession;
use Illuminate\Http\Request;

class EntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $entries = Entry::where('name', '!=', 'null');

        if($request->get('q'))
        {
            $entries = $entries->whereHas("franchise", function ($query) use ($request) {
                $query->where('name', "LIKE", "%" . $request->get('q') . "%");
            });
        }

        if($request->get('limit'))
        {
            $entries = $entries->limit($request->get('limit'));
        }

        $entries = $entries->with(["franchise.category"]);

        return response()->json($entries->get()->map(function ($entry) {
            return [
                'id' => $entry->id,
                'name' => $entry->franchise->name . ": " . $entry->name,
                'category' => $entry->franchise->category->name,
                'coverUrl' => $entry->cover_url,
                'creators' => $entry->creators->pluck('name'),
            ];
        } ));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Entry $entry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Entry $entry)
    {
        $request->validate([
            'sessionToken' => 'required',
            'franchiseName' => 'required',
            'name' => 'required',
            'length' => 'required|numeric|min:0',
            'coverUrl' => 'required|url'
        ]);

        if(!UserSession::where('session', $request->get('sessionToken'))->exists())
        {
            return response()->json(['error' => 'You have to provide a session token to update an entry'], 401);
        }

        $entry->franchise->name = $request->json('franchiseName');
        $entry->name = $request->json('name');
        $entry->length = $request->json('length');
        $entry->cover_url = $request->json('coverUrl');

        $entry->franchise->save();
        $entry->save();
        
        return response()->json(['message' => 'Successfully updated entry']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Entry $entry)
    {
        //
    }
}
