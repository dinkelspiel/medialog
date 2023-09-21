<?php

use App\Http\Controllers\UserEntryController;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\VerifySession;
use App\Livewire\Auth\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware([VerifySession::class])->group(function() {
    Route::get('/dashboard', App\Livewire\Dashboard\Index::class);
    
    Route::get('/dashboard/add', App\Livewire\Dashboard\Add\AddFranchise::class);

    Route::get('/profile', App\Livewire\Profile\Index::class);
});

Route::get('/login', App\Livewire\Auth\Index::class)->name('login');