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
            --secondary_hover: #E4755D;
            --secondary_active: #E98F7C;
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

        .c-border-secondary {
            border-color: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
        }

        .c-ring-card {
            --tw-ring-color: {{ auth()->user()->colorScheme->card ?? 'var(--card)' }};
        }

        .c-hover-bg-card:hover {
            background: {{ auth()->user()->colorScheme->card ?? 'var(--card)' }};
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

        .c-border-r-secondary {
            border-right-color: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
        }

        .c-border-r-outline {
            border-right-color: {{ auth()->user()->colorScheme->outline ?? 'var(--outline)' }};
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

        .c-ring-outline {
            --tw-ring-color: {{ auth()->user()->colorScheme->outline ?? 'var(--outline)' }};
        }

        .c-outline-card {
            outline-color: {{ auth()->user()->colorScheme->card ?? 'var(--card)' }};
        }

        .c-shadow-card {
            box-shadow: 0px 4px 24px 0px rgba(170, 170, 170, 0.10);
        }

        @media (min-width: 1024px) {
            .c-lg\:shadow-none {
                box-shadow: none;
            }

            .c-lg\:bg-background {
                background: {{ auth()->user()->colorScheme->background ?? 'var(--background)' }};
            }
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

        .c-slider {
            background-color: {{ auth()->user()->colorScheme->card ?? 'var(--card)' }};
        }

        .c-slider::-webkit-slider-thumb {
            background-color: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
        }

        .c-slider::-webkit-slider-thumb:hover {
            background-color: {{ auth()->user()->colorScheme->secondary_hover ?? 'var(--secondary_hover)' }};
        }

        .c-slider::-webkit-slider-thumb:active {
            background-color: {{ auth()->user()->colorScheme->secondary_active ?? 'var(--secondary_active)' }};
        }

        .c-slider::-moz-range-thumb {
            background-color: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
        }

        .c-slider::-moz-range-thumb:hover {
            background-color: {{ auth()->user()->colorScheme->secondary_hover ?? 'var(--secondary_hover)' }};
        }

        .c-slider::-moz-range-thumb:active {
            background-color: {{ auth()->user()->colorScheme->secondary_active ?? 'var(--secondary_active)' }};
        }
    </style>
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
