<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifySession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect("/login");
        }

        return $next($request);
    }
}
