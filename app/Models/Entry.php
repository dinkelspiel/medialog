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

    public function themes(): BelongsToMany
    {
        return $this->belongsToMany(Theme::class, 'entry_themes');
    }

    public function producers(): BelongsToMany
    {
        return $this->belongsToMany(Person::class, 'entry_producers');
    }

    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class, 'entry_genres');
    }

    public function cast(): BelongsToMany
    {
        return $this->belongsToMany(Person::class, 'entry_cast');
    }

    public function userEntries(): HasMany
    {
        return $this->hasMany(UserEntry::class);
    }
}
