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

    .c-text-textgray {
        color: {{ auth()->user()->colorScheme->text_gray ?? 'var(--text_gray)' }};
    }

    .c-text-background {
        color: {{ auth()->user()->colorScheme->background ?? 'var(--background)' }};
    }

    .c-fill-text {
        fill: {{ auth()->user()->colorScheme->text ?? 'var(--text)' }};
    }

    .c-fill-background {
        fill: {{ auth()->user()->colorScheme->background ?? 'var(--background)' }};
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

    .c-hover\:bg-card:hover {
        background: {{ auth()->user()->colorScheme->card ?? 'var(--card)' }};
    }

    .c-active\:bg-card-active:active {
        background: {{ auth()->user()->colorScheme->card_active ?? 'var(--card_active)' }};
    }

    .c-hover\:border-secondary:hover {
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

    .c-hover\:bg-secondary-hover:hover {
        background: {{ auth()->user()->colorScheme->secondary_hover ?? 'var(--secondary_hover)' }};
    }

    .c-active\:bg-secondary-active:active {
        background: {{ auth()->user()->colorScheme->secondary_active ?? 'var(--secondary_active)' }};
    }

    .c-border-r-outline {
        border-right-color: {{ auth()->user()->colorScheme->outline ?? 'var(--outline)' }};
    }

    .c-text-secondary {
        color: {{ auth()->user()->colorScheme->secondary ?? 'var(--secondary)' }};
    }

    .c-hover\:text-secondary-hover:hover {
        color: {{ auth()->user()->colorScheme->secondary_hover ?? 'var(--secondary_hover)' }};
    }

    .c-active\:text-secondary-active:active {
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
