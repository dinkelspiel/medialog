<form action="/api/user/entry" method="post" class="p-3 h-full flex flex-col gap-3">
    @method('PATCH')
    @csrf
    @if(isset($error))
        {{ $error }}
    @else 
        <div class="flex flex-row items-center gap-3">
            <div class="text-lg font-semibold">
                {{ $userEntry->entry->franchise->name }}
            </div>
            <div class="text-lg font-normal">
                {{ $userEntry->entry->name }}
            </div>
            <button wire:click="closeUserEntry" class="ms-auto bg-none hover:bg-secondary-hover active:bg-secondary-active duration-200 w-8 h-8 rounded-lg">
                X
            </button>
        </div>

        <input type="hidden" name="id" value="{{ $userEntry->id }}">
        <div id="rating-label">
            Rating
        </div>
        <div class="flex flex-row-reverse gap-3 items-center">
            <input class="slider" id="rating" type="range" min="0" max="100" name="rating" value="{{ $userEntry->rating }}" oninput="this.nextElementSibling.value = this.value">
            <output class="w-5">{{ $userEntry->rating }}</output>
        </div>
        <div>
            Notes
        </div>
        <textarea class="w-full input !max-h-full !h-1/2 resize-none !text-base p-3" name="notes">{{ $userEntry->notes }}</textarea>
        <button class="btn mt-auto">
            Save
        </button>
    @endif
</div>
