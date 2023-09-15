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

        if(!isset($_SESSION['id'])) 
        {
            return redirect('/login');
        }

        $sessionId = $_SESSION['id'];

        $user = User::where('id', $sessionId)->first();

        if(is_null($user))
        {
            $_SESSION = [];
            return redirect('/login');
        }

        $_SESSION['id'] = $user->id;
        $_SESSION['username'] = $user->username;
        $_SESSION['email'] = $user->email;

        $request->attributes->add(['user' => $user]);

        return $next($request);
    }    
}
