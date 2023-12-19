<div {{ $attributes->merge(['class' => 'relative']) }}>
    <select
        {{ $attributes->merge(['class' => 'appearance-none h-14 border-2 c-border-card rounded-full c-bg-background px-6 w-full flex flex-row text-left c-text-gray']) }}>
        {{ $slot }}
    </select>
    @if (!isset($showCaret))
        <x-icons.caret class="absolute right-6 top-1/2 -translate-y-1/2" />
    @endif
</div>
