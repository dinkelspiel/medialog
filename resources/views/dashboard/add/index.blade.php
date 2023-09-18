@extends('layouts.app', [
    'header' => 'dashboard'
])
@section('content')
<div class="h-screen max-h-screen overflow-y-scroll">
    <livewire:dashboard.add.franchise />
</div>
@endsection