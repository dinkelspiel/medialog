<?php

namespace App\Models;

use App\Enums\UserRatingStyleEnum;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = ['username', 'email', 'rating_style'];

    protected $hidden = ['password'];

    protected $casts = [
        'rating_style' => UserRatingStyleEnum::class
    ];
}
