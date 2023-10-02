<div class="grid h-screen" style="grid-template-columns: 0.9fr 1.2fr 0.9fr">
    <div class="grid-item my-3 rounded-lg bg-card">
        <livewire:dashboard.add />
    </div>
    <div class="grid-item m-3 flex flex-col scrollable-grid-item no-scrollbar">
        <div>
            @foreach($userEntries as $browserEntry)
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
