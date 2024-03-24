<?php

namespace App\Http\Controllers\User;

use App\Enums\ActivityTypeEnum;
use App\Enums\UserEntryStatusEnum;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\User;
use App\Models\UserEntry;
use App\Models\UserFollow;
use App\Models\UserSession;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function get(User $user)
    {
        // Generate ratings graph
        $ratings = [];
        $totalRatings = UserEntry::where("user_id", $user->id)->where('status', UserEntryStatusEnum::Completed)->count();
        for ($ratingThreshold = 0; $ratingThreshold <= 10; $ratingThreshold++) {
            if ($totalRatings > 0) {
                $ratings[$ratingThreshold - 1] = UserEntry::where("user_id", $user->id)->where('status', UserEntryStatusEnum::Completed)->where('rating', '>', ($ratingThreshold - 1) * 10)->where('rating', '<=', $ratingThreshold * 10)->count() / $totalRatings;
            } else {
                $ratings[$ratingThreshold - 1] = 0;
            }
        }

        $ratings[0] += $ratings[-1];
        unset($ratings[-1]);

        // Generate Diary

        $diary = [];

        foreach (UserEntry::where("user_id", $user->id)->where('status', UserEntryStatusEnum::Completed)->orderByDesc('watched_at')->limit(10)->get() as $userEntry) {
            $month = strtoupper(substr(Carbon::parse($userEntry->watched_at)->format('F'), 0, 3));

            $diary[$month][] = [
                'entryName' => $userEntry->entry->name,
                'franchiseName' => $userEntry->entry->franchise->name,
                'entries' => $userEntry->entry->franchise->entries->count(),
                'day' => Carbon::parse($userEntry->watched_at)->day
            ];
        }
        ;

        $diary = collect($diary);

        $d = [];

        foreach ($diary as $key => $value) {
            $sortedValue = collect($value)->sortByDesc('day');
            $d[$key] = $sortedValue->values()->all();
        }

        // Get Viewer

        $viewerUser = User::where('username', request()->get('viewer-username'))->first();

        return response()->json([
            "username" => $user->username,
            "watched" => UserEntry::where('user_id', $user->id)->where('status', UserEntryStatusEnum::Completed)->count(),
            "watchedThisYear" => UserEntry::where('user_id', $user->id)->where('status', UserEntryStatusEnum::Completed)->whereYear('created_at', Carbon::now()->year)->count(),
            "favorites" => UserEntry::where('user_id', $user->id)->where('status', UserEntryStatusEnum::Completed)->orderByDesc('rating')->limit(4)->get()->map(function ($userEntry) {
                return [
                    'id' => $userEntry->id,
                    'franchiseName' => $userEntry->entry->franchise->name,
                    'entryName' => $userEntry->entry->name,
                    'coverUrl' => $userEntry->entry->cover_url,
                    'entries' => $userEntry->entry->franchise->entries->count(),
                    'updatedAt' => $userEntry->updated_at,
                    'watchedAt' => $userEntry->watched_at,
                    'rating' => $userEntry->rating,
                    'status' => $userEntry->status
                ];
            }),
            "activity" => Activity::where('user_id', $user->id)->orderByDesc('id')->limit(10)->get()->map(function ($activity) {
                return [
                    'type' => $activity->type,
                    'additionalData' => $activity->additional_data,
                    'franchiseName' => $activity->entry->franchise->name,
                    'entryName' => $activity->entry->name,
                    'entries' => $activity->entry->franchise->entries->count(),
                    'franchiseCategory' => $activity->entry->franchise->category,
                    'coverUrl' => $activity->entry->cover_url,
                    'rating' => $activity->type == ActivityTypeEnum::Reviewed || $activity->type == ActivityTypeEnum::CompleteReview ? UserEntry::where('user_id', $activity->user_id)
                        ->where('entry_id', $activity->entry_id)
                        ->first()
                        ->getLatestCompleted()->rating : 0,
                    'createdAtHuman' => $activity->created_at->diffForHumans(),
                    'createdAt' => $activity->created_at
                ];
            }),
            "watchlistCount" => UserEntry::where('user_id', $user->id)->where('status', UserEntryStatusEnum::Planning)->count(),
            "watchlist" => UserEntry::where('user_id', $user->id)->where('status', UserEntryStatusEnum::Planning)->limit(4)->get()->map(function ($userEntry) {
                return [
                    'coverUrl' => $userEntry->entry->cover_url
                ];
            }),
            "ratingsCount" => UserEntry::where('user_id', $user->id)->where('status', UserEntryStatusEnum::Completed)->count(),
            "ratings" => $ratings,
            "diary" => $d,
            "dailyStreak" => $user->getDailyStreak(),
            "dailyStreakUpdated" => Carbon::parse($user->daily_streak_updated)->gt(Carbon::today()),
            "isViewerFollowing" => $viewerUser && $viewerUser->id !== $user->id ? UserFollow::where('user_id', $viewerUser->id)->where('follow_id', $user->id)->where('is_following', true)->exists() : false,
            "following" => UserFollow::where('user_id', $user->id)->where('is_following', true)->get()->map(function (UserFollow $follow) use ($viewerUser) {
                return [
                    'username' => $follow->follow->username,
                    'followingCount' => UserFollow::where('user_id', $follow->follow->id)->where('is_following', true)->count(),
                    'followersCount' => UserFollow::where('follow_id', $follow->follow->id)->where('is_following', true)->count(),
                    'watched' => UserEntry::where('user_id', $follow->follow->id)->where('status', UserEntryStatusEnum::Completed)->count(),
                    'isViewerFollowing' => $viewerUser && $viewerUser->id !== $follow->follow->id ? UserFollow::where('user_id', $viewerUser->id)->where('follow_id', $follow->follow->id)->where('is_following', true)->exists() : false
                ];
            }),
            "followers" => UserFollow::where('follow_id', $user->id)->where('is_following', true)->get()->map(function (UserFollow $follow) use ($viewerUser) {
                return [
                    'username' => $follow->user->username,
                    'followingCount' => UserFollow::where('user_id', $follow->user->id)->where('is_following', true)->count(),
                    'followersCount' => UserFollow::where('follow_id', $follow->user->id)->where('is_following', true)->count(),
                    'watched' => UserEntry::where('user_id', $follow->user->id)->where('status', UserEntryStatusEnum::Completed)->count(),
                    'isViewerFollowing' => $viewerUser && $viewerUser->id !== $follow->user->id ? UserFollow::where('user_id', $viewerUser->id)->where('follow_id', $follow->user->id)->where('is_following', true)->exists() : false
                ];
            }),
            "watching" => UserEntry::where('user_id', $user->id)->where('status', UserEntryStatusEnum::Watching)->get()->map(function ($userEntry) {
                return [
                    'id' => $userEntry->id,
                    'franchiseName' => $userEntry->entry->franchise->name,
                    'entryName' => $userEntry->entry->name,
                    'entries' => $userEntry->entry->franchise->entries->count(),
                    'progress' => $userEntry->progress,
                    'length' => $userEntry->entry->length
                ];
            }),
        ]);
    }
}
