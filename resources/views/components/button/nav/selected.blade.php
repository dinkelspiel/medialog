<x-button.nav.base {{ $attributes->merge(['class' => 'border-2 border-card relative c-hover-bg-secondary-hover']) }}>
    <div class="c-bg-secondary w-1 h-[14px] rounded-full -left-0.5 absolute ring-2 c-ring-background">

    </div>
    {{ $slot }}
</x-button.nav.base>
