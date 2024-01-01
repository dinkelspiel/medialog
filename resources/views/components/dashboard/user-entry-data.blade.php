<div class="flex flex-col gap-2 p-8 border-s-2 c-border-secondary ms-[27px]">
    <div class="text-left text-neutral-400 text-xs col-span-2 {{ isset($canChange) ? 'ps-[27px]' : '' }}">
        @switch($userEntry->entry->franchise->category->id)
            @case(1)
                Amount of pages read
            @break

            @case(2)
                Amount of episodes watched
            @break

            @case(3)
                Watched minutes
            @break

            @default
                Invalid category {{ $userEntry->entry->franchise->category->name }}
        @endswitch
    </div>
    <div class="flex flex-row items-center gap-4 col-span-2">
        @if (isset($canChange))
            <x-input class="flex-1" type="number" :value="$userEntry->progress" {{ $attributes }} />
            <div class="w-max">
                / {{ $userEntry->entry->length }}
            </div>
        @else
            <div class="w-max">
                {{ $userEntry->progress }} / {{ $userEntry->entry->length }}
            </div>
        @endif
    </div>
</div>
