<div class="p-3">
    <div class="grid grid-cols-2 gap-2 pb-6 border-b border-b-outline border-dashed">
        <input class="input col-span-2" placeholder="Title">
        <input class="input col-span-2" placeholder="Season">

        <input class="input" placeholder="Studio">
        <input class="input" placeholder="Category">

        <input class="input" placeholder="Genres">
        <input class="input" placeholder="Themes">
    </div>
    <div class="py-6 border-b w-full border-b-outline border-dashed">
        <input class="input w-full" placeholder="Sort After">
    </div>
    <div class="flex flex-row gap-3 items-center pt-6">
        <div class="flex flex-row gap-2">
            <div>
                Include all franchises
            </div>
            <input type="checkbox" wire:click="toggleIncludeAllFranchises" @if($includeAllFranchises) checked @endif>
        </div>
        <div class="flex flex-row gap-2">
            <div>
                Include already watched
            </div>
            <input type="checkbox" wire:click="toggleIncludeAlreadyWatched" @if($includeAlreadyWatched) checked @endif>
        </div>
    </div>
    <div class="pt-3 w-full">
        <button class="btn" @if(!$canGetRandom)disabled @else wire:click="getRandom" @endif>
            I'm feeling lucky
        </button>
        <div class="text-left text-neutral-400 text-xs pt-2">
            Get a random media from Medialog with the given parameters
        </div>
    </div>
    @if(!$canGetRandom)
        <div class="error mt-3">
            You must have atleast one un-completed franchise
        </div>
    @endif
    @if(!is_null($franchise))
        <div class="pt-6 rounded-lg h-20 w-full object-cover flex flex-col gap-3">
            <img src="{{ $franchise->entries->first()->cover_url }}" class="rounded-lg h-60 w-full object-cover">
            <div>
                <i>{{ $franchise->name }}</i>. A <i>{{ $franchise->category->name }}</i> made by @foreach ($franchise->entries as $entry) <i>{{ $entry->studio->name }}</i>@if($loop->remaining == 1) and @elseif(!$loop->last),@endif @endforeach
            </div>
        </div>
    @endif
</div>
