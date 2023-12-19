<button
    {{ $attributes->merge([
        'class' =>
            'w-full p-3 text-left rounded-lg duration-200 c-border-background  c-hover-bg-card-hover  active:rounded-xl c-active-bg-card-active  c-hover-border-secondary  border-dashed border gap-4 flex flex-row cursor-pointer',
    ]) }}>
    @if (count($entry->franchise->entries) > 0)
        <img src="{{ $entry->cover_url }}" class="rounded-lg w-24 object-cover aspect-[2/3]">
    @endif

    <div class="flex flex-col justify-center my-auto gap-3">
        <div class="flex flex-row items-center gap-2">
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
            @switch(auth()->user()->subtext_style->value)
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
            <div class="w-full h-[2px] c-bg-outline">
                
            </div>
            <div class="flex flex-row gap-3">
                @for ($i = 0; $i < 10; $i++)
                    @if (round($rating / 10) >= $i + 1)
                        <x-icons.star class="c-fill-secondary" />
                    @else
                        <x-icons.star-outline class="c-fill-outline" />
                    @endif
                @endfor
            </div>
        @endisset
    </div>
</button>
