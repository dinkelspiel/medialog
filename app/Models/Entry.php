<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entry extends Model
{
    use HasFactory;

    // Studio
    // Media

    public function theme(): HasMany
    {
        return $this->hasMany(Theme::class);
    }

    public function producer(): HasMany
    {
        return $this->hasMany(Person::class);
    }

    public function genre(): HasMany
    {
        return $this->hasMany(Genre::class);
    }

    public function actor(): HasMany
    {
        return $this->hasMany(Person::class);
    }
}
