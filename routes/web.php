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
})->middleware(['web', VerifySession::class]);

Route::get('/dashboard/add', function () {
    return view('dashboard.add.index');
})->middleware(['web', VerifySession::class]);

Route::get('/login', function () {
    if(!is_null(session('id')))
    {
        return redirect('/dashboard');
    }

    return view('login.index');
})->middleware(['web']);