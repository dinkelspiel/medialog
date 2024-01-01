<?php

namespace App\Models;

use App\Enums\UserEntryStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserEntry extends Model
{
    use HasFactory;

    protected $fillable = ["rating", "notes"];

    protected $casts = [
        "status" => UserEntryStatusEnum::class,
    ];

    public function entry(): BelongsTo
    {
        return $this->belongsTo(Entry::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getLatestRating(): int
    {
        return UserEntry::where("entry_id", $this->entry_id)
            ->where("status", "completed")
            ->orderBy("watched_at", "DESC")
            ->first()->rating ?? 0;
    }
}
