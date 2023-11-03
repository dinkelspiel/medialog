<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class ColorScheme extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'creator_id',
        'background',
        'card',
        'card_hover',
        'card_active',
        'secondary',
        'secondary_hover',
        'secondary_active',
        'outline',
        'text',
        'text_gray'
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function users(): HasManyThrough
    {
        return $this->hasManyThrough(User::class, UserColorScheme::class);
    }
}
