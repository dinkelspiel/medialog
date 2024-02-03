<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EntryStudio extends Model
{
    use HasFactory;

    protected $fillable = ["studio_id", "entry_id", "id"];

    public function entry(): BelongsTo
    {
        return $this->belongsTo(Entry::class);
    }

    public function studio(): BelongsTo
    {
        return $this->belongsTo(Studio::class);
    }
}
