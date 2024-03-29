<?php

use App\Http\Controllers\UserEntryController;
use App\Http\Middleware\Authenticate;
use App\Http\Middleware\AuthorizeAdmin;
use App\Http\Middleware\VerifySession;
use App\Livewire\Auth\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Request;
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

Route::get("/user/@{username}", function (Request $request, string $username) {
    $user = User::where("username", $username)->first();

    if (is_null($user)) {
        abort(403, "Unauthorized action.");
        return;
    }

    return redirect("/user/$user->id");
});
Route::get("/user/{userId}", App\Livewire\Profile\Index::class);
Route::get("/invite/{userId}", App\Livewire\Community\Invite::class);

Route::middleware([VerifySession::class])->group(function () {
    Route::get("/dashboard", App\Livewire\Dashboard\Index::class);

    Route::get("/dashboard/add", App\Livewire\Dashboard\Modify\Add::class);

    Route::get("/settings", App\Livewire\Profile\Settings::class);

    Route::get("/color-schemes", App\Livewire\ColorSchemes::class);

    Route::get("/friend-search", App\Livewire\Community\FriendSearch::class);
});

Route::middleware([VerifySession::class, AuthorizeAdmin::class])->group(
    function () {
        Route::get("/admin", function () {
            return redirect("/admin/entries");
        });

        Route::get(
            "/dashboard/edit/{franchiseId}",
            App\Livewire\Dashboard\Modify\Edit::class,
        );

        Route::get("/admin/entries", App\Livewire\Admin\Entries::class);
    },
);

Route::get("/", App\Livewire\Homepage::class)->name("homepage");
Route::get("/login", App\Livewire\Auth\Index::class)->name("login");
