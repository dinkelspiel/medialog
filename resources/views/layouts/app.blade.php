<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medialog</title>

    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    @vite('resources/css/app.css')
    @livewireStyles
</head>
<body>
    <div class="grid absolute inset-0 bg-background dark:bg-dark-background mr-3 text-text dark:text-dark-text" style="grid-template-columns: 5rem 1fr">
        <div class="h-[calc(100dvh)]">
            @include('includes.header', [
                'page' => $header
            ])
        </div>
        <div class="max-h-[calc(100dvh)] h-[calc(100dvh)]">
            @if(isset($slot))
                {{ $slot }}
            @endif
            @yield('content')
        </div>
    </div>

    @livewireScripts
</body>
</html>
