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
        session_start();

        if(is_null($request->session()->get('id'))) 
        {
            return redirect('/login');
        }

        $sessionId = $request->session()->get('id');

        $user = User::where('id', $sessionId)->first();

        if(is_null($user))
        {
            $request->session()->forget(['id', 'username', 'email']);
            return redirect('/login');
        }

        $request->session()->put('id', $user->id);
        $request->session()->put('username', $user->username);
        $request->session()->put('email', $user->email);

        $request->attributes->add(['user' => $user]);

        return $next($request);
    }    
}
