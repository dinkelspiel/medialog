<x-button.base
    {{ $attributes->merge(['class' => 'text-white c-bg-secondary c-active:bg-secondary-hover c-active:bg-secondary-active']) }}>
    {{ $slot }}
</x-button.base>
