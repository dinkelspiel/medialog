@extends('layouts.base', [
    'header' => 'profile'
])
@section('content')
<div class="px-96 py-3">
    <form action="/api/auth/logout" method="POST">
        @csrf
        <button class="btn w-full" type="submit">
            Logout
        </button>
    </form>
</div>
@endsection