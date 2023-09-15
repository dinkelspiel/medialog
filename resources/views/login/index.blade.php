@extends('layouts.base')
@section('content')
<div class="flex flex-col items-center h-screen justify-center gap-12">
    <div class="flex flex-col md:flex-row mx-auto w-max justify-center items-center">
        <form action="/api/user" method="post" class="border-secondary border-b pb-6 md:border-b-0 md:pb-0 md:border-r border-dashed flex flex-col md:pr-10 gap-3 md:h-96 justify-center">
            @csrf
            <input class="input" placeholder="Username" name="user" required>
            <input class="input" placeholder="Email" type="email" name="email" required>
            <input class="input mb-3" placeholder="Password" type="password" name="password" required>
            <button class="btn" type="submit">Sign up</button>
        </form>
        <form action="/api/auth/login" method="post" class="flex flex-col pt-6 md:pt-0 md:ps-10 gap-3">
            @csrf
            <input class="input" placeholder="Email" name="email" type="email" required>
            <input class="input mb-3" placeholder="Password" name="password" type="password" required>
            <button class="btn" type="submit">Log in</button>
        </div>
        @if ($errors->any())
        <div class="max-w-full bg-red-500 border border-red-600 rounded-lg h-14 px-6 justify-center leading-13 text-center text-white">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    </div>
</div>
@endsection