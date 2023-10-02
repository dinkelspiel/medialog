<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Entry extends Model
{
    use HasFactory;

    protected $fillable = [
        'studio', 'media', 'id'
    ];

    public function franchise(): BelongsTo
    {
        return $this->BelongsTo(Franchise::class);
    }

    public function studio(): BelongsTo
    {
        return $this->belongsTo(Studio::class);
    }

    public function producers(): BelongsToMany
    {
        return $this->belongsToMany(Person::class, 'entry_producers');
    }

    public function userEntries(): HasMany
    {
        return $this->hasMany(UserEntry::class);
    }
}
