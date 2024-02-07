<?php

namespace App\Models;

use App\Enums\UserEntryStatusEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class UserEntry extends Model
{
    use HasFactory;

    protected $fillable = ["rating", "notes", "user_id", "entry_id", "watched_at", "status", "progress"];

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

    public function getLatestCompleted(): ?UserEntry
    {
        return UserEntry::where("entry_id", $this->entry_id)
            ->where("user_id", $this->user_id)
            ->where("status", "completed")
            ->orderBy("watched_at", "DESC")
            ->first();
    }

    public function getLatest(): ?UserEntry
    {
        return UserEntry::where("entry_id", $this->entry_id)
            ->where("user_id", $this->user_id)
            ->orderBy(DB::raw('ISNULL(watched_at)'), 'desc')
            ->orderBy("watched_at", "DESC")
            ->first();
    }
}
