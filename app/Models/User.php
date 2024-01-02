<?php

namespace App\Models;

use App\Enums\UserRatingStyleEnum;
use App\Enums\UserSubtextStyleEnum;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        "username",
        "email",
        "rating_style",
        "subtext_style",
        "daily_streak_continued",
        "daily_streak_length",
        "daily_streak_longest",
        "invited_by",
    ];

    protected $hidden = ["password"];

    protected $casts = [
        "rating_style" => UserRatingStyleEnum::class,
        "subtext_style" => UserSubtextStyleEnum::class,
    ];

    public function permission(): HasOne
    {
        return $this->hasOne(UserPermission::class);
    }

    public function entries(): HasMany
    {
        return $this->hasMany(UserEntry::class);
    }

    public function colorScheme(): HasOneThrough
    {
        return $this->hasOneThrough(
            ColorScheme::class,
            UserColorScheme::class,
            "user_id",
            "id",
            "id",
            "color_scheme_id",
        );
    }

    public function userColorScheme(): HasOne
    {
        return $this->hasOne(UserColorScheme::class);
    }

    public function getDailyStreak(): int
    {
        if (
            Carbon::parse($this->daily_streak_updated)
                ->startOfDay()
                ->diffInMinutes(Carbon::now()->endOfDay(), false) > 2880
        ) {
            if ($this->daily_streak_length > $this->daily_streak_longest) {
                $this->daily_streak_longest = $this->daily_streak_length;
            }
            $this->daily_streak_length = 0;
            $this->save();
            return 0;
        }

        $this->daily_streak_length =
            Carbon::parse($this->daily_streak_started)
                ->startOfDay()
                ->diffInDays(
                    Carbon::parse($this->daily_streak_updated)->startOfDay(),
                ) + 1;
        if ($this->daily_streak_length > $this->daily_streak_longest) {
            $this->daily_streak_longest = $this->daily_streak_length;
        }
        $this->save();
        return $this->daily_streak_length;
    }

    public function pushDailyStreak()
    {
        $this->getDailyStreak();

        if ($this->daily_streak_length == 0) {
            $this->daily_streak_started = Carbon::now();
            $this->daily_streak_updated = Carbon::now();

            $this->save();
            return;
        }

        $this->daily_streak_updated = Carbon::now();
        $this->save();
    }
}
