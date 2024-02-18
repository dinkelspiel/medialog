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
            ->groupBy("entry_id")
            ->get(["id", "rating", "status", "entry_id", "user_id", "watched_at", "updated_at"])
            ->map(function ($userEntry) {
                return [
                    "id" => $userEntry->getLatest()->id,
                    "franchiseName" => $userEntry->entry->franchise->name,
                    "entryName" => $userEntry->entry->name,
                    "coverUrl" => $userEntry->entry->cover_url,
                    "entries" => $userEntry->entry->franchise->entries->count(),
                    "updatedAt" => $userEntry->updated_at->toDateTimeString(),
                    "rating" => $userEntry->getLatestCompleted() ? $userEntry->getLatestCompleted()->rating : 0,
                    "watchedAt" => $userEntry->getLatestCompleted() ? $userEntry->getLatestCompleted()->watched_at : null,
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
        if(UserSession::where('session', $request->get('sessionToken'))->first()->user->id != $userId)
        {
            return response()->json(['error' => 'You do not have permission to add user entries to this user'], 401);
        }

        $request->validate([
            'entryId' => 'required|exists:entries,id',
        ]);

        if($request->json('notes') === null && $request->json("rating") === null)
        {
            if(UserEntry::where('watched_at', null)->where('entry_id', $request->json('entryId'))->exists())
            {
                $userEntry = UserEntry::where('watched_at', null)->where('entry_id', $request->json('entryId'))->first();
            } else {
                $userEntry = UserEntry::create([
                    'entry_id' => $request->json('entryId'),
                    'user_id' => $userId,
                    'status' => UserEntryStatusEnum::Planning
                ]);
            }

            return response()->json(['message' => 'Successfully created planning user entry', 'id' => $userEntry->id]);
        }

        $request->validate([
            'rating' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string'
        ]);

        $userEntry = UserEntry::create([
            'entry_id' => $request->json('entryId'),
            'user_id' => $userId,
            'rating' => $request->json('rating'),
            'notes' => $request->json('notes') ?? "",
            'watched_at' => now(),
            'status' => UserEntryStatusEnum::Completed
        ]);

        return response()->json(['message' => 'Successfully created completed user entry', 'id' => $userEntry->id]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $userId, UserEntry $userEntry)
    {
        if(UserSession::where('session', $request->get('sessionToken'))->first()->user->id != $userId)
        {
            return response()->json(['error' => 'You do not have permission to show user entries by this user'], 401);
        }

        $userEntry = $userEntry->with(['entry', 'entry.franchise'])->where('id', $userEntry->id)->first();

        if($userEntry->user_id !== $userId)
        {
            return response()->json(['error' => 'You do not have permission to show user entries by this user'], 401);
        }

        return [
            "id" => $userEntry->id,
            "franchiseName" => $userEntry->entry->franchise->name,
            "entryId" => $userEntry->entry->id,
            "entryName" => $userEntry->entry->name,
            "entryLength" => $userEntry->entry->length,
            "entryCoverUrl" => $userEntry->entry->cover_url,
            "releaseYear" => 2023,
            "entries" => $userEntry->entry->franchise->entries->count(),
            "userEntries" => $userEntry->entry->userEntries->map(function($userEntry) use($userId) {
                if($userEntry->user_id != $userId) {
                    return;
                }

                return [
                    "id" => $userEntry->id,
                    "rating" => $userEntry->rating,
                    "watchedAt" => $userEntry->watched_at
                ];
            })->filter(fn($userEntry, $key) => $userEntry !== null),
            "rating" => $userEntry->rating,
            "notes" => $userEntry->notes,
            "status" => $userEntry->status,
            "progress" => $userEntry->progress,
            "watchedAt" => $userEntry->watched_at
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $userId, UserEntry $userEntry)
    {
        $request->validate([
            'sessionToken' => 'required',
            'rating' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:planning,watching,paused,dnf,completed',
            'progress' => 'nullable|numeric|min:0'
        ]);

        if(UserSession::where('session', $request->get('sessionToken'))->first()->user->id != $userId)
        {
            return response()->json(['error' => 'You do not have permission to add user entries to this user'], 401);
        }

        if($request->json('rating') !== null)
        {
            $userEntry->rating = $request->json('rating');
        }
        if($request->json('notes') !== null)
        {
            $userEntry->notes = $request->json('notes');
        }
        if($request->json('status') !== null)
        {
            $userEntry->status = $request->json('status');
            if($request->json('status') === 'completed')
            {
                $userEntry->watched_at = now();
                $userEntry->progress = $userEntry->entry->length;
            }
        }
        if($request->json('progress') !== null)
        {
            $userEntry->progress = $request->json('progress');
            if($userEntry->progress >= $userEntry->entry->length)
            {
                $userEntry->status = 'completed';
                $userEntry->watched_at = now();
            }
            if($userEntry->progress < 0)
            {
                $userEntry->progress = 0;
            }
        }
        $userEntry->updated_at = now();
        $userEntry->save();

        return response()->json(['message' => 'Successfully updated user entry']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserEntry $userEntry)
    {
        //
    }
}
