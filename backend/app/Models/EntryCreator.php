<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EntryCreator extends Model
{
    use HasFactory;

    public function entry(): BelongsTo
    {
        return $this->belongsTo(Entry::class);
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
}
