<form wire:submit.prevent="update" class="p-3 h-full flex flex-col gap-3">
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
            <button wire:click="closeUserEntry" class="ms-auto text-secondary hover:text-secondary-hover active:text-secondary-active duration-100 cursor-pointer">
                X
            </button>
        </div>

        <input type="hidden" name="id" value="{{ $userEntry->id }}">
        @if($userEntry->rating != 0)
            <div id="rating-label">
                Rating
            </div>
            <div class="flex flex-row-reverse gap-3 items-center">
                <input class="slider" id="rating" type="range" min="0" max="100" name="rating" wire:model="userEntry.rating">
                <output class="w-5">{{ $userEntry->rating }}</output>
            </div>
            <div>
                Notes
            </div>
            <textarea class="w-full input !max-h-full !h-1/2 resize-none !text-base p-3" name="notes" wire:model="userEntry.notes"></textarea>
        @else

        @endif
        <button class="btn mt-auto">
            Save
        </button>
    @endif
</form>
