@if ($selected == true)
    <div class="flex flex-row gap-4 items-center cursor-pointer" {{ $attributes }}>
        <x-icons.circle class="c-bg-secondary border-0">
            <x-dynamic-component component="icons.{{ $icon }}" class="h-[18px] c-fill-background" />
        </x-icons.circle>
        {{ $label }}
    </div>
@else
    <div class="flex flex-row gap-4 items-center cursor-pointer" {{ $attributes }}>
        <x-icons.circle>
            <x-dynamic-component component="icons.{{ $icon }}" />
        </x-icons.circle>
        {{ $label }}
    </div>
@endif
