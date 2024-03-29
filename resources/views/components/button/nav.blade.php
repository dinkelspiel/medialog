<div class="flex flex-row lg:flex-col gap-3 lg:gap-1 text-base lg:text-xs items-center rounded-full">
    <x-button.nav.base class="c-active:bg-secondary-hover">
        {{ $slot }}
    </x-button.nav.base>
    <div class="block lg:hidden">
        {{ $label ?? 'Label' }}
    </div>
</div>
