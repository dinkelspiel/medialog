<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Entry;
use App\Models\UserEntry;
use Illuminate\Http\Request;

class UserEntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(int $userId)
    {
        $userEntries = UserEntry::where("user_id", 41)
            ->with([
                "entry.franchise",
                "entry" => function ($query) {
                    $query->select(
                        "id",
                        "name",
                        "cover_url",
                        "updated_at",
                        "franchise_id",
                    );
                },
            ])
            ->get(["rating", "status", "entry_id"])
            ->map(function ($userEntry) {
                return [
                    "franchise_name" => $userEntry->entry->franchise->name,
                    "enty_name" => $userEntry->entry->name,
                    "cover_url" => $userEntry->entry->cover_url,
                    "updated_at" => $userEntry->entry->updated_at->toDateTimeString(),
                    "rating" => $userEntry->rating,
                    "status" => $userEntry->status,
                ];
            });

        return response()->json($userEntries);
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
    public function show(UserEntry $userEntry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserEntry $userEntry)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserEntry $userEntry)
    {
        //
    }
}
