<div {{ $attributes->merge(['class' => 'relative']) }}>
    <input
        {{ $attributes->merge(['class' => 'h-14 c-bg-background border-2 c-border-card rounded-full px-6 w-full flex flex-row text-left c-text-gray']) }} />
    @isset($showCaret)
        <x-icons.caret class="absolute right-6 top-1/2 -translate-y-1/2" />
    @endisset
</div>
