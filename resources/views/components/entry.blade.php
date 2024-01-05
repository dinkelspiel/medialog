<button
    {{ $attributes->merge([
        'class' =>
            'w-full p-3 text-left rounded-[24px] duration-200 c-ring-outline c-active:bg-card active:rounded-[32px] c-active:border-secondary hover:ring-2 gap-4 flex flex-row cursor-pointer',
    ]) }}>
    @if (count($entry->franchise->entries) > 0)
        <img src="{{ $entry->cover_url }}" class="rounded-[16px] w-20 object-cover aspect-[2/3]">
    @endif

    <div class="flex flex-col justify-center my-auto gap-3 w-full">
        <div class="flex flex-col md:flex-row justify-center md:items-center md:justify-start gap-2">
            <div class="font-semibold">
                {{ $entry->franchise->name }}
            </div>
            @if (count($entry->franchise->entries) > 1)
                <div class="c-text-text">
                    {{ $entry->name }}
                </div>
            @endif
        </div>
        <div class="c-text-text">
            @switch(auth()->check() ? auth()->user()->subtext_style->value : "studio")
                @case('studio')
                    @foreach ($entry->studios()->distinct()->get() as $studio)
                        <i>{{ $studio->name }}</i>
                        @if ($loop->remaining == 1)
                            and
                        @elseif(!$loop->last)
                            ,
                        @endif
                    @endforeach
                @break

                @case('creator')
                    @foreach ($entry->creators()->distinct()->get() as $creator)
                        <i>{{ $creator->name }}</i>
                        @if ($loop->remaining == 1)
                            and
                        @elseif(!$loop->last)
                            ,
                        @endif
                    @endforeach
                @break

            @endswitch
        </div>
        @isset($rating)
            <div class="w-[50%] h-[2px] c-bg-outline">

            </div>
            <div class="flex-row gap-3 flex items-center">
                @for ($i = 0; $i < 5; $i++)
                    @if (floor($rating / 20) >= $i + 1)
                        <x-icons.star class="c-fill-secondary" />
                    @endif
                @endfor
                @php
                    $fraction = $rating / 20 - floor($rating / 20);

                    $showHalf = $fraction >= 0.3 && $fraction <= 0.7;
                    $showFull = $fraction > 0.7;
                @endphp
                @if ($showHalf)
                    <x-icons.star-half class="c-fill-secondary" />
                @endif
                @if ($showFull)
                    <x-icons.star class="c-fill-secondary" />
                @endif
            </div>
        @endisset
    </div>
</button>
