<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medialog</title>

    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    @vite('resources/css/app.css')

    <style>
        :root {
            --background: #FFFFFF;
            --card: #F5F5F5;
            --card_hover: #F2DBD9;
            --card_active: #EDCDC9;
            --secondary: #E16449;
            --secondary_hover: #c6685d;
            --secondary_active: #d6938a;
            --outline: #D1D1D1;
            --text: #1C1B1F;
            --text_gray: #808080;
        }

        .c-text-text {
            color: {{ auth()->user()->colorScheme->text ?? 'var(--text)' }};
        }

        .c-fill-text {
            fill: {{ auth()->user()->colorScheme->text ?? 'var(--text)' }};
        }

        .option {
            color: {{ auth()->user()->colorScheme->text ?? 'var(--text)' }};
        }

        .c-bg-background {
            background: {{ auth()->user()->colorScheme->background ?? 'var(--background)' }};
        }

        .c-border-background {
            border-color: {{ auth()->user()->colorScheme->background ?? 'var(--background)' }};
        }

        .c-border-card {
            border-color: {{ auth()->user()->colorScheme->card ?? 'var(--card)' }};
        }

        .c-ring-card {
            --tw-ring-color: {{ auth()->user()->colorScheme->card ?? 'var(--card)' }};
        }

        .c-hover-bg-card-hover:hover {
            background: {{ auth()->user()->colorScheme->card_hover ?? 'var(--card_hover)' }};
        }

        .c-active-bg-card-active:active {
            background: {{ auth()->user()->colorScheme->card_active ?? 'var(--card_active)' }};
        }

        .c-hover-border-secondary:hover {
            border-color: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
        }

        .c-bg-card {
            background: {{ auth()->user()->colorScheme->card ?? 'var(--card)' }};
        }

        .c-bg-secondary {
            background: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
        }

        .c-bg-outline {
            background: {{ auth()->user()->colorScheme->outline ?? 'var(--outline)' }};
        }

        .c-border-b-outline {
            border-bottom-color: {{ auth()->user()->colorScheme->outline ?? 'var(--outline)' }};
        }

        .c-border-t-outline {
            border-top-color: {{ auth()->user()->colorScheme->outline ?? 'var(--outline)' }};
        }

        .c-border-outline {
            border-color: {{ auth()->user()->colorScheme->outline ?? 'var(--outline)' }};
        }

        .c-hover-bg-secondary-hover:hover {
            background: {{ auth()->user()->colorScheme->secondary_hover ?? 'var(--secondary_hover)' }};
        }

        .c-active-bg-secondary-active:active {
            background: {{ auth()->user()->colorScheme->secondary_active ?? 'var(--secondary_active)' }};
        }

        .c-border-r-outline {
            border-right-color: {{ auth()->user()->colorScheme->outline ?? 'var(--outline)' }};
        }

        .c-text-secondary {
            color: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
        }

        .c-hover-text-secondary-hover:hover {
            color: {{ auth()->user()->colorScheme->secondary_hover ?? 'var(--secondary_hover)' }};
        }

        .c-active-text-secondary-active:active {
            color: {{ auth()->user()->colorScheme->secondary_active ?? 'var(--secondary_active)' }};
        }

        .c-ring-background {
            --tw-ring-color: {{ auth()->user()->colorScheme->background ?? 'var(--background)' }};
        }

        .c-outline-card {
            outline-color: {{ auth()->user()->colorScheme->card ?? 'var(--card)' }};
        }

        .c-shadow-card {
            box-shadow: 0px 4px 24px 0px rgba(170, 170, 170, 0.10);
        }

        .c-fill-secondary {
            fill: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
        }

        .c-fill-outline {
            fill: {{ auth()->user()->colorScheme->outline ?? 'var(--outline)' }};
        }

        .text-btn {
            color: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
            transition-duration: 100ms;
            cursor: pointer;
        }

        .text-btn:hover {
            color: {{ auth()->user()->colorScheme->secondary_hover ?? 'var(--secondary_hover)' }};
        }

        .input-primary {
            border-color: {{ auth()->user()->colorScheme->outline ?? 'var(--outline)' }};
        }

        .btn-primary {
            color: white;
            background: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
        }

        .btn-primary:hover {
            background: {{ auth()->user()->colorScheme->secondary_hover ?? 'var(--secondary_hover)' }};
        }

        .btn-primary:active {
            background: {{ auth()->user()->colorScheme->secondary_active ?? 'var(--secondary_active)' }};
        }
    </style>
</head>

<body class="c-bg-background c-text-text">
    <div class="grid absolute inset-0 mr-3" style="grid-template-columns: 5rem 1fr">
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
