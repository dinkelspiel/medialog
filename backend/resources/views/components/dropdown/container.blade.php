<div
    {{ $attributes->merge(['class' => 'c-bg-card absolute w-full top-16 rounded-[32px] c-border-outline  !border-t-0 border c-shadow-card p-[30px] flex flex-col gap-3 max-h-96 overflow-y-scroll z-10']) }}>
    {{ $slot }}
</div>
