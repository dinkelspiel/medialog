<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserEntryController;
use App\Http\Middleware\VerifySession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware([VerifySession::class, 'web'])->group(function() {
    Route::patch('/user/entries/{entryId}', [UserEntryController::class, 'update']);
    Route::delete('/user/entries/{entryId}', [UserEntryController::class, 'delete']);
});

