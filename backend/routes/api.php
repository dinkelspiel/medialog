<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EntryController;
use App\Http\Controllers\FranchiseController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\UserEntryController;
use App\Http\Controllers\User\UserController;
use App\Http\Middleware\Authenticate;
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

Route::get("/franchises", [FranchiseController::class, "index"]);

Route::get("/entries", [EntryController::class, "index"]);
Route::prefix("/entries")->group(function () {
    Route::middleware([Authenticate::class])->group(function() {
        Route::patch("/{entry}", [EntryController::class, "update"]);
    });
});

Route::prefix("/auth")->group(function () {
    Route::post("/login", [AuthController::class, "login"]);
    Route::middleware([Authenticate::class])->group(function() {
        Route::get("/validate", [AuthController::class, "validateSession"]);
    });
});

Route::post("/users", [UserController::class, "store"]);
Route::patch("/users/{user}", [UserController::class, "update"]);
Route::get("/users/{user}", [UserController::class, "show"]);
Route::get("/users/{user}/profile", [ProfileController::class, "get"]);


Route::prefix("/users/{userId}")->group(function () {
    Route::get("/entries", [UserEntryController::class, "index"]);
    Route::middleware([Authenticate::class])->group(function() {
        Route::put("/entries", [UserEntryController::class, "store"]);
        Route::get("/entries/{userEntry}", [UserEntryController::class, "show"]);
        Route::patch("/entries/{userEntry}", [UserEntryController::class, "update"]);
    });
});
