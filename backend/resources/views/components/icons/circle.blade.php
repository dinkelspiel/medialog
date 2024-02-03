<div {{ $attributes->merge(['class' => 'w-[54px] h-[54px] relative border-2 c-border-outline rounded-full']) }}>
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 c-fill-text">{{ $slot }}</div>
</div>
