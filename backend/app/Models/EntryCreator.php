<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EntryCreator extends Model
{
    use HasFactory;

    protected $fillable = ["person_id", "entry_id", "id"];


    public function entry(): BelongsTo
    {
        return $this->belongsTo(Entry::class);
    }

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
}
