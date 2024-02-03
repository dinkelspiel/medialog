<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSession extends Model
{
    use HasFactory;

    protected $fillable = ["session", "user_id"];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
