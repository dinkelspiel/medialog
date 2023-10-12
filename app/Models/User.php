<?php

namespace App\Models;

use App\Enums\UserRatingStyleEnum;
use App\Enums\UserSubtextStyleEnum;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = ['username', 'email', 'rating_style', 'subtext_style'];

    protected $hidden = ['password'];

    protected $casts = [
        'rating_style' => UserRatingStyleEnum::class,
        'subtext_style' => UserSubtextStyleEnum::class
    ];

    public function permission(): HasOne
    {
        return $this->hasOne(UserPermission::class);
    }

    public function entries(): HasMany
    {
        return $this->hasMany(UserEntry::class);
    }
}
