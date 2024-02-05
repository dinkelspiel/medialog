<?php

namespace App\Http\Controllers\User;

use App\Enums\UserEntryStatusEnum;
use App\Http\Controllers\Controller;
use App\Models\Entry;
use App\Models\User;
use App\Models\UserEntry;
use App\Models\UserSession;
use Illuminate\Http\Request;

class UserEntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $userId)
    {
        $userEntries = UserEntry::where("user_id", $userId)
            ->with([
                "user",
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
            ->orderBy("user_entries.rating", "desc")
            ->groupBy("entry_id")
            ->get(["id", "rating", "status", "entry_id", "user_id"])
            ->map(function ($userEntry) {
                return [
                    "id" => $userEntry->id,
                    "franchiseName" => $userEntry->entry->franchise->name,
                    "entryName" => $userEntry->entry->name,
                    "coverUrl" => $userEntry->entry->cover_url,
                    "entries" => $userEntry->entry->franchise->entries->count(),
                    "updatedAt" => $userEntry->entry->updated_at->toDateTimeString(),
                    "rating" => UserEntry::where('entry_id', $userEntry->entry->id)->where('user_id', $userEntry->user->id)->first()->rating,
                    "status" => $userEntry->status,
                ];
            });

        return response()->json($userEntries);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $userId)
    {
        if(!Entry::where('id', $request->json('entryId'))->exists())
        {
            return response()->json(['error' => 'No entry with id exists'], 401);
        }

        if(UserSession::where('session', $request->get('sessionToken'))->first()->user->id != $userId)
        {
            return response()->json(['error' => 'You do not have permission to add user entries to this user'], 401);
        }

        UserEntry::create([
            'entry_id' => $request->json('entryId'),
            'user_id' => $userId,
            'rating' => $request->json('rating'),
            'notes' => $request->json('notes') ?? "",
            'watched_at' => now(),
            'status' => UserEntryStatusEnum::Completed
        ]);

        return response()->json(['message' => 'Successfully created user entry']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $userId, UserEntry $userEntry)
    {
        if(UserSession::where('session', $request->get('sessionToken'))->first()->user->id != $userId)
        {
            return response()->json(['error' => 'You do not have permission to add user entries to this user'], 401);
        }

        $userEntry = $userEntry->with(['entry', 'entry.franchise'])->where('id', $userEntry->id)->first();
        return [
            "id" => $userEntry->id,
            "franchiseName" => $userEntry->entry->franchise->name,
            "entryName" => $userEntry->entry->name,
            "releaseYear" => 2023,
            "rating" => $userEntry->rating,
            "notes" => $userEntry->notes
        ];
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
