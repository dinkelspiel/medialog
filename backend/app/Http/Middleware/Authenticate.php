<?php

namespace App\Http\Middleware;

use App\Models\UserSession;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if($request->json('sessionToken') === null && $request->get('sessionToken') === null)
        {
            return response()->json(["error" => "No session token provided"], 401);
        }

        if(!UserSession::where('session', $request->json('sessionToken') ?? $request->get('sessionToken'))->exists())
        {
            return response()->json(["error" => "No session exists with token"], 401);
        }

        return $next($request);;
    }
}
