<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medialog</title>

    <link rel="icon" type="image/x-icon" href="/favicon.svg">

    @vite('resources/css/app.css')
    @vite('resources/js/app.js')

    @include('includes.dynamic-styles')
</head>

<body class="c-bg-background c-text-text relative h-[100dvh]">
    <div
        class="grid absolute inset-0 ms-3 lg:ms-0 mr-3 grid-cols-1 h-[100dvh] lg:grid-cols-[89px,1fr] grid-rows-[5rem,1fr] lg:grid-rows-1">
        <div>
            @include('includes.header', [
                'page' => $header,
            ])
        </div>
        <div>
            @if (isset($slot))
                {{ $slot }}
            @endif
            @yield('content')
        </div>
    </div>
</body>

</html>
