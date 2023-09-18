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
    <div class="grid h-screen bg-color mr-3" style="grid-template-columns: 5rem 1fr">
        <div class="grid-item">
            @include('includes.header', [
                'page' => 'home'
            ])
        </div>
        <div class="grid-item">
            @yield('content')
        </div>
    </div>

    @livewireScripts
</body>
</html>
