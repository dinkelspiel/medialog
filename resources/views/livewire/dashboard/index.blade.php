<div class="grid h-[calc(100dvh)] grid-cols-1 lg:grid-cols-[0.9fr,1.2fr,0.9fr] gap-8 relative py-8">
    <div class="rounded-[32px] scrollable-grid-item">
        <livewire:dashboard.search-franchise />
    </div>
    <div class="flex flex-col scrollable-grid-item no-scrollbar">
        <div>
            <div class="font-semibold text-xl flex flex-row justify-between items-center py-4">
                My Media

                <x-icons.circle.sort />
            </div>
        </div>
        <div>
            @foreach ($userEntries as $browserEntry)
                @if (!is_null($browserEntry->entry->franchise))
                    <button
                        class="h-20 w-full text-left rounded-lg duration-200 c-border-background  c-hover-bg-card-hover  active:rounded-xl c-active-bg-card-active  c-hover-border-secondary  border-dashed border p-3 flex flex-row cursor-pointer"
                        wire:click="showUserEntry({{ $browserEntry->id }})">
                        @include('includes.entry', [
                            'entry' => $browserEntry->entry,
                        ])
                    </button>
                @endif
            @endforeach
        </div>
    </div>
    @if ($userEntry)
        <div class="rounded-[32px] c-bg-card p-8 flex flex-col absolute z-10 w-full lg:relative">
            @if (isset($error))
                <div class="error">
                    {{ $error }}
                </div>
            @else
                <div class="flex flex-row items-center gap-3">
                    <div class="flex flex-row w-full gap-3 justify-center">
                        <div class="text-lg font-semibold">
                            {{ $userEntry->entry->franchise->name }}
                        </div>
                        @if (count($userEntry->entry->franchise->entries) > 1)
                            <div class="text-lg font-nsemiboldormal">
                                {{ $userEntry->entry->name }}
                            </div>
                        @endif
                    </div>
                    <button wire:click="closeUserEntry"
                        class="ms-auto text-secondary  hover:text-secondary-hover active:text-secondary-active duration-100 cursor-pointer">
                        X
                    </button>
                </div>
                @if (!is_null($userEntry->watched_at))
                    <div class="flex flex-col gap-3 h-full">
                        @method('PATCH')
                        @csrf

                        <input type="hidden" name="entry_id" value="{{ $userEntry->id }}">
                        <div id="rating-label" class="font-semibold">
                            Rating
                        </div>
                        @switch(auth()->user()->rating_style)
                            @case(\App\Enums\UserRatingStyleEnum::Range)
                                <div class="flex flex-row-reverse gap-3 items-center">
                                    <input class="slider" id="rating" type="range" min="0" max="100"
                                        name="rating" wire:model="userEntry.rating"
                                        oninput="this.nextElementSibling.value = this.value">
                                    <output class="w-5">{{ $userEntry->rating }}</output>
                                </div>
                            @break

                            @case(\App\Enums\UserRatingStyleEnum::Stars)
                                <div class="grid grid-cols-10">
                                    @for ($i = 0; $i < 10; $i++)
                                        <button class="text-4xl cursor-pointer c-text-secondary "
                                            wire:click="setRating({{ ($i + 1) * 10 }})">
                                            @if (round($userEntry->rating / 10) >= $i + 1)
                                                &#9733;
                                            @else
                                                &#9734;
                                            @endif
                                        </button>
                                    @endfor
                                </div>
                            @break
                        @endswitch
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

                        @if (session()->has('userEntryMessage'))
                            <div class="success">
                                {{ session('userEntryMessage') }}
                            </div>
                        @endif
                        <div class="flex gap-3">
                            <button wire:click="saveUserEntry" class="btn btn-primary mt-auto">
                                Save
                            </button>
                            <button wire:click="deleteUserEntry" class="btn btn-primary !w-max px-10">
                                Remove
                            </button>
                        </div>
                    </div>
        </div>
    @else
        <button wire:click="markAsComplete({{ $userEntry->id }})" type="submit" class="btn btn-primary my-auto">
            Mark as complete
        </button>
    @endif
    @endif
</div>
@endif
</div>
