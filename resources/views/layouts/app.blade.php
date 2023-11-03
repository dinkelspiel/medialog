<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medialog</title>

    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    @vite('resources/css/app.css')

<style>

@if(auth()->user()->colorScheme)
    .c-text-text {
        color: {{ auth()->user()->colorScheme->text }};
    }

    .option {
        color: {{ auth()->user()->colorScheme->text }};
    }

    .c-bg-background {
        background: {{ auth()->user()->colorScheme->background }};
    }

    .c-border-background {
        border-color: {{ auth()->user()->colorScheme->background }};
    }

    .c-hover-bg-card-hover:hover {
        background: {{ auth()->user()->colorScheme->background }};
    }

    .c-active-bg-card-active:active {
        background: {{ auth()->user()->colorScheme->card_active }};
    }

    .c-hover-border-secondary:hover {
        border-color: {{ auth()->user()->colorScheme->secondary }};
    }

    .c-bg-card {
        background: {{ auth()->user()->colorScheme->card }};
    }

    .c-bg-secondary {
        background: {{ auth()->user()->colorScheme->secondary }};
    }

    .c-c-bg-outline {
        background: {{ auth()->user()->colorScheme->outline }};
    }

    .c-border-b-outline {
        border-bottom-color: {{ auth()->user()->colorScheme->outline }};
    }

    .c-hover-bg-secondary-hover:hover {
        background: {{ auth()->user()->colorScheme->secondary_hover }};
    }

    .c-active-bg-secondary-active:active {
        background: {{ auth()->user()->colorScheme->secondary_active }};
    }

    .c-border-r-outline {
        border-right-color: {{ auth()->user()->colorScheme->outline }};
    }

    .c-text-secondary {
        color: {{ auth()->user()->colorScheme->secondary }};
    }

    .c-hover-text-secondary-hover:hover {
        color: {{ auth()->user()->colorScheme->secondary_hover }};
    }

    .c-active-text-secondary-active:active {
        color: {{ auth()->user()->colorScheme->secondary_active }};
    }

    .text-btn {
        color: {{ auth()->user()->colorScheme->secondary }};
        transition-duration: 100ms;
        cursor: pointer;
    }

    .text-btn:hover {
        color: {{ auth()->user()->colorScheme->secondary_hover }};
    }

    .text-btn:active {
        color: {{ auth()->user()->colorScheme->secondary_active }};
    }

    .icon-btn-white:hover {
        background: {{ auth()->user()->colorScheme->secondary_hover }};
    }

    .icon-btn-white:active {
        background: {{ auth()->user()->colorScheme->secondary_active }};
    }

    .icon-btn-pink {
        background: {{ auth()->user()->colorScheme->secondary }};
    }

    .icon-btn-pink:hover {
        background: {{ auth()->user()->colorScheme->secondary_hover }};
    }

    .icon-btn-pink:active {
        background: {{ auth()->user()->colorScheme->secondary_active }};
    }
@else
    .color-text {
        color: #1C1B1F;
    }

    .option {
        color: #1C1B1F;
    }

    .c-bg-background {
        background: #FFFBFE;
    }
@endif

</style>
</head>

<body class="c-bg-background c-text-text">
    <div class="grid absolute inset-0 mr-3" style="grid-template-columns: 5rem 1fr">
        <div class="h-[calc(100dvh)]">
            @include('includes.header', [
                'page' => $header,
            ])
        </div>
        <div class="max-h-[calc(100dvh)] h-[calc(100dvh)]">
            @if (isset($slot))
                {{ $slot }}
            @endif
            @yield('content')
        </div>
    </div>
</body>

</html>
