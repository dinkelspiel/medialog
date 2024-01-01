<div
    class="flex flex-row lg:flex-col gap-3 lg:gap-1 text-base lg:text-xs items-center rounded-full c-shadow-card c-bg-card c-lg:shadow-none c-lg:bg-background">
    <x-button.nav.base
        {{ $attributes->merge(['class' => 'border-2 c-border-outline relative c-active:bg-secondary-hover']) }}>
        <div class="c-bg-secondary w-1 h-[14px] rounded-full -left-0.5 absolute ring-2 c-ring-background">

        </div>
        {{ $slot }}
    </x-button.nav.base>
    <div>
        {{ $label ?? 'Label' }}
    </div>
</div>
