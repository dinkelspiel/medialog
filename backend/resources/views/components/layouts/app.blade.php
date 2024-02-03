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

<body>
    {{ $slot }}
</body>

</html>
