<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Franchise extends Model
{
    use HasFactory;

    // Name
    // Category

    protected $fillable = [
        'name'
    ];

    function category(): HasOne
    {
        return $this->hasOne(Category::class);
    }
}
