<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medialog</title>

    @vite('resources/css/app.css')
</head>
<body>
    <div class="grid grid-cols-[5rem,1fr,1fr,1fr] h-screen bg-color">
        <div class="grid-item">
            @include('includes/header')
        </div>
        <div class="grid-item my-3 rounded-lg bg-card">
            
        </div>
        <div class="grid-item m-3 flex flex-col">

        </div>
        <div class="grid-item my-3 mr-3 rounded-lg bg-card">
            
        </div>
    </div> 
</body>
</html>