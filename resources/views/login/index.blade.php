@extends('layouts.base')
@section('content')
<body>
    <div class="flex flex-row mx-auto w-max h-screen justify-center items-center">
        <div class="border-secondary border-r border-dashed flex flex-col pr-10 gap-3 h-96 justify-center">
            <input class="input">
            <input class="input">
            <input class="input mb-3">
            <button class="btn">Sign up</button>
        </div>
        <div class="flex flex-col ps-10 gap-3">
            <input class="input">
            <input class="input mb-3">
            <button class="btn">Log in</button>
        </div>
    </div>
</body>
@stop