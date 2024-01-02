<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserFollow extends Model
{
    use HasFactory;

    protected $fillable = ["user_id", "follow_id", "is_following"];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function follow(): BelongsTo
    {
        return $this->belongsTo(User::class, "follow_id");
    }

    public static function isMututal(int $user_1, int $user_2): bool
    {
        return UserFollow::where("user_id", $user_1)
            ->where("follow_id", $user_2)
            ->where("is_following", true)
            ->exists() &&
            UserFollow::where("user_id", $user_2)
                ->where("follow_id", $user_1)
                ->where("is_following", true)
                ->exists();
    }
}
