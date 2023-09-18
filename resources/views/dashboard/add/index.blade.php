@extends('layouts.base', [
    'header' => 'dashboard'
])
@section('content')
<div class="h-screen max-h-screen overflow-y-scroll">
    <livewire:add-franchise />
</div>
@endsection