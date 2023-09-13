@extends('layouts.base')
@section('content')
<div class="grid h-screen" style="grid-template-columns: 1fr 1fr 1fr">
    <div class="grid-item my-3 rounded-lg bg-card">
        @include('dashboard/includes/add')
    </div>
    <div class="grid-item m-3 flex flex-col">

    </div>
    <div class="grid-item my-3 rounded-lg bg-card">
        a
    </div>
</div>
@stop