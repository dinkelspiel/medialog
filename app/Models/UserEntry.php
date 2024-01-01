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
}
