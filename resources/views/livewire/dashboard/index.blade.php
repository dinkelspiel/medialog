<div class="grid h-screen" style="grid-template-columns: 0.9fr 1.2fr 0.9fr">
    <div class="grid-item my-3 rounded-lg bg-card">
        <div class="grid h-16 border-b border-b-outline" style="grid-template-columns: 1fr 1fr">
            <button wire:click="setPage('add')" class="@if($page == 'add') bg-outline @endif grid-item flex justify-center items-center text-lg font-medium cursor-pointer hover:bg-secondary-hover active:bg-secondary-active duration-100 rounded-tl-lg border-r border-r-outline">
                Add
            </button>
            <button wire:click="setPage('filter')" class="@if($page == 'filter') bg-outline @endif grid-item flex justify-center items-center text-lg font-medium cursor-pointer hover:bg-secondary-hover active:bg-secondary-active duration-100 rounded-tr-lg">
                Filter
            </button>
        </div>
        @if($page == 'add')
            <livewire:dashboard.search-franchise /> 
        @elseif($page == 'filter')
            <div class="p-3">
                <div class="grid grid-cols-2 gap-2 pb-6 border-b border-b-outline border-dashed">
                    <input class="input col-span-2" placeholder="Title" type="text" wire:model="sortTitle">
                    <input class="input col-span-2" placeholder="Season" type="text" wire:model="sortSeason">
                    {{ $sortTitle }}
                    <input class="input" placeholder="Studio">
                    <input class="input" placeholder="Category">
                </div>
                <div class="py-6 border-b w-full border-b-outline border-dashed">
                    <div class="pb-1">
                        Sort After
                    </div>
                    <select class="input w-full" placeholder="Sort After" wire:change="setSortAfter($event.target.value)">
                        @foreach($sortAfterArray as $sort)
                            <option>
                                {{ $sort }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="flex flex-row gap-3 items-center pt-6 pb-1">
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
                        <img src="{{ $franchise->entries->first()->cover_url }}" class="rounded-lg h-20 w-full object-cover">
                        <div>
                            <i>{{ $franchise->name }}</i>. A <i>{{ $franchise->category->name }}</i> made by @foreach ($franchise->entries as $entry) <i>{{ $entry->studio->name }}</i>@if($loop->remaining == 1) and @elseif(!$loop->last),@endif @endforeach
                        </div>
                        <button class="btn" wire:click="addFranchise">
                            Add
                        </button>
                    </div>
                @endif
            </div>
        @else
            <div>   
                Invalid page
            </div>
        @endif
    </div>
    <div class="grid-item m-3 flex flex-col scrollable-grid-item no-scrollbar">
        <div>
            @foreach($userEntries as $browserEntry)
                @if(!is_null($browserEntry->entry->franchise))
                    <button wire:click="showUserEntry({{ $browserEntry->id }})" class="h-20 w-full text-left rounded-lg duration-200 border-color hover:bg-card-hover active:rounded-xl active:bg-card-active hover:border-secondary border-dashed border p-3 flex flex-row cursor-pointer">
                        @if(count($browserEntry->entry->franchise->entries) > 0)
                            <img src="{{ $browserEntry->entry->cover_url }}" class="rounded-lg h-full w-28 object-cover">
                        @else
                            <img src="/assets/noimg.png" class="rounded-lg h-full w-28 object-cover">
                        @endif

                        <div class="ms-3 flex flex-col justify-center" style="gap: -5px">
                            @if(count($browserEntry->entry->franchise->entries) > 1)
                                <div class="text-xs text-slate-800">
                                    {{ $browserEntry->entry->name }}
                                </div>
                            @endif
                            <div class="text-base">
                                {{ $browserEntry->entry->franchise->name }}
                            </div>
                            <div class="text-sm text-slate-800">
                                {{ $browserEntry->entry->studio->name }}
                            </div>
                        </div>
                    </button>
                @endif
            @endforeach
        </div>
    </div>
    @if($userEntry)
        <div class="grid-item my-3 rounded-lg bg-card p-3 flex flex-col">
            @if(isset($error))
                <div class="error">
                    {{ $error }}
                </div>
            @else
                <div class="flex flex-row items-center gap-3">
                    <div class="flex flex-row w-full gap-3 justify-center">
                        <div class="text-lg font-semibold">
                            {{ $userEntry->entry->franchise->name }}
                        </div>
                        @if( count($userEntry->entry->franchise->entries) > 1 )
                            <div class="text-lg font-nsemiboldormal">
                                {{ $userEntry->entry->name }}
                            </div>
                        @endif
                    </div>
                    <button wire:click="closeUserEntry" class="ms-auto text-secondary hover:text-secondary-hover active:text-secondary-active duration-100 cursor-pointer">
                        X
                    </button>
                </div>
                @if(!is_null($userEntry->watched_at))
                    <div class="flex flex-col gap-3 h-full">
                        @method('PATCH')
                        @csrf

                        <input type="hidden" name="entry_id" value="{{ $userEntry->id }}">
                        <div id="rating-label" class="font-semibold">
                            Rating
                        </div>
                        <div class="flex flex-row-reverse gap-3 items-center">
                            <input class="slider" id="rating" type="range" min="0" max="100" name="rating" wire:model="userEntry.rating" oninput="this.nextElementSibling.value = this.value">
                            <output class="w-5">{{ $userEntry->rating }}</output>
                        </div>
                        <div class="font-semibold">
                            Notes
                        </div>
                        <textarea class="w-full input !h-full resize-none !text-base p-3" name="notes" wire:model="userEntry.notes">{{ $userEntry->notes }}</textarea>
                        <div class="grid grid-cols-2">
                            <div class="grid-item font-semibold">
                                Watched
                            </div>
                            <div class="grid-item font-semibold text-right">
                                Last Updated
                            </div>
                            <div class="grid-item">
                                {{ $userEntry->watched_at }}
                            </div>
                            <div class="grid-item text-right">
                                {{ $userEntry->updated_at }}
                            </div>
                        </div>

                        @if(session()->has('userEntryMessage'))
                            <div class="success">
                                {{ session('userEntryMessage') }}
                            </div>
                        @endif
                        <div class="flex gap-3">
                            <button wire:click="saveUserEntry" class="btn mt-auto">
                                Save
                            </button>
                            <button wire:click="deleteUserEntry" class="btn !w-max px-10">
                                Remove
                            </button>
                        </div>
                    </div>
                    </div>
                @else
                    <button wire:click="markAsComplete({{ $userEntry->id }})" type="submit" class="btn my-auto">
                        Mark as complete
                    </button>
                @endif
            @endif
        </div>
    @endif
</div>
