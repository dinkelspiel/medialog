<?php

use App\Http\Middleware\Authenticate;
use App\Http\Middleware\VerifySession;
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

Route::get('/dashboard', function () {
    return view('dashboard.index');
})->middleware(VerifySession::class);

Route::get('/login', function () {
    return view('login.index');
})->middleware(VerifySession::class);