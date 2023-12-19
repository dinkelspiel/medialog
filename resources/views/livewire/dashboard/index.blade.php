<div class="grid h-[calc(100dvh)] grid-cols-1 lg:grid-cols-[0.9fr,1.2fr,0.9fr] gap-8 relative py-8">
    <div class="rounded-[32px] scrollable-grid-item c-shadow-card">
        <livewire:dashboard.search-franchise />
    </div>
    <div class="flex flex-col scrollable-grid-item no-scrollbar px-2">
        <div x-data="{ open: false }">
            <div class="font-semibold text-xl flex flex-row justify-between items-center py-4">
                My Media

                <div class="flex row gap-4">
                    <x-button.secondary class="!w-max px-8 flex flex-row items-center gap-3" wire:click="cycleSortAfter">
                        @switch($sortAfter)
                            @case('Watched')
                                <x-icons.eye />
                                Watched
                            @break

                            @case('Updated')
                                <x-icons.clock />
                                Updated
                            @break

                            @case('Rating')
                                <x-icons.star />
                                Rating
                            @break

                            @case('A-Z')
                                <x-icons.az />
                                A-Z
                            @break

                            @default
                        @endswitch
                    </x-button.secondary>
                    <x-icons.circle.sort class="c-hover-bg-card-hover cursor-pointer" x-on:click="open = !open" />
                </div>
            </div>
            <div x-show="open"
                class="rounded-[32px] border-2 c-border-card c-shadow-card grid grid-cols-2 gap-2 p-[30px] relative mb-8">

                <div class="font-semibold text-xl text-center col-span-2">
                    Filter
                </div>

                {{-- Filter Options --}}
                <div class="flex flex-row gap-4 items-center w-full col-span-2">
                    <x-icons.circle.search />
                    <x-input class="flex-grow" placeholder="Title" type="text" wire:model.live="filterTitle" />
                </div>
                <x-input class="col-span-2" placeholder="Season" type="text" wire:model.live="filterSeason" />

                <div class="grid grid-cols-1 w-full relative" x-data="{ open: true }">
                    <x-input showCaret class="w-full" placeholder="Production Studio"
                        wire:model.live="filterSearchStudio" @focus="open = true" />
                    @if ($filterSearchStudio != '' && $filterStudio == '0')
                        <x-dropdown.container x-show="open">
                            @foreach (\App\Models\Studio::where('name', 'LIKE', '%' . $filterSearchStudio . '%')->orderBy('name')->get() as $studio)
                                <x-dropdown.button wire:click="setFilterStudio(`{{ $studio->name }}`)"
                                    @click="open = false">
                                    {{ $studio->name }}
                                </x-dropdown.button>
                            @endforeach
                        </x-dropdown.container>
                    @endif
                </div>

                <div class="grid grid-cols-1 w-full relative" x-data="{ open: true }">
                    <x-input showCaret class="w-full" placeholder="Director/Writer"
                        wire:model.live="filterSearchCreator" @focus="open = true" />
                    @if ($filterSearchCreator != '' && $filterCreator == 0)
                        <x-dropdown.container x-show="open">
                            @foreach (\App\Models\Person::where('name', 'LIKE', '%' . $filterSearchCreator . '%')->orderBy('name')->get() as $person)
                                <x-dropdown.button wire:click="setFilterCreator(`{{ $person->name }}`)"
                                    @click="open = false">
                                    {{ $person->name }}
                                </x-dropdown.button>
                            @endforeach
                        </x-dropdown.container>
                    @endif
                </div>

                <x-select class="col-span-2" wire:model.live="filterCategory" placeholder="Category">
                    <option value="0">
                        Select a Category
                    </option>
                    @foreach (\App\Models\Category::all() as $category)
                        <option value="{{ $category->id }}">
                            {{ $category->name }}
                        </option>
                    @endforeach
                </x-select>
            </div>
        </div>
        <div>
            @foreach ($userEntries as $browserEntry)
                @if (!is_null($browserEntry->entry->franchise))
                    <x-entry :entry="$browserEntry->entry" :rating="$browserEntry->rating" wire:click="showUserEntry({{ $browserEntry->id }})" />
                @endif
            @endforeach
        </div>
    </div>
    @if ($userEntry)
        <div class="fixed z-5 top-0 left-0 w-[100dvw] h-[100dvh] bg-black opacity-50 lg:hidden">

        </div>
        <div
            class="rounded-[32px] c-bg-background border-2 c-border-card c-shadow-card p-[30px] flex flex-col absolute z-10 bottom-8 h-1/2 w-full lg:bottom-0 lg:relative lg:h-full">
            @if (isset($error))
                <div class="error">
                    {{ $error }}
                </div>
            @else
                <div class="flex flex-row items-center gap-4">
                    <div class="flex flex-row w-full gap-3 justify-center text-xl">
                        @if ($userEntry->entry)
                            <div class="text-lg font-semibold">
                                {{ $userEntry->entry->franchise->name }}
                            </div>
                            @if (count($userEntry->entry->franchise->entries) > 1)
                                <div class="text-lg font-normal">
                                    {{ $userEntry->entry->name }}
                                </div>
                            @endif
                        @endif
                    </div>
                    <button wire:click="closeUserEntry"
                        class="ms-auto text-secondary  hover:text-secondary-hover active:text-secondary-active duration-100 cursor-pointer">
                        <x-icons.xmark />
                    </button>
                </div>
                @if (!is_null($userEntry->watched_at))
                    <div class="flex flex-col gap-3 h-full">
                        @method('PATCH')
                        @csrf

                        <input type="hidden" name="entry_id" value="{{ $userEntry->id }}">
                        <div id="rating-label">
                            Rating
                        </div>
                        @switch(auth()->user()->rating_style)
                            @case(\App\Enums\UserRatingStyleEnum::Range)
                                <div class="flex flex-row-reverse gap-3 items-center">
                                    <x-slider id="rating" type="range" min="0" max="100" name="rating"
                                        wire:model="userEntry.rating" oninput="this.nextElementSibling.value = this.value" />
                                    <output class="w-5">{{ $userEntry->rating }}</output>
                                </div>
                            @break

                            @case(\App\Enums\UserRatingStyleEnum::Stars)
                                <div class="flex items-center justify-center gap-[10px]">
                                    @for ($i = 0; $i < 10; $i++)
                                        <button class="text-4xl cursor-pointer c-text-secondary "
                                            wire:click="setRating({{ ($i + 1) * 10 }})">
                                            @if (round($userEntry->rating / 10) >= $i + 1)
                                                <x-icons.star class="c-fill-secondary" />
                                            @else
                                                <x-icons.star-outline class="c-fill-outline" />
                                            @endif
                                        </button>
                                    @endfor
                                </div>
                            @break
                        @endswitch
                        <div>
                            Notes
                        </div>
                        <textarea class="w-full appearance-none c-bg-background !h-full resize-none !text-base p-0" name="notes"
                            placeholder="Write some notes..." wire:model="userEntry.notes">{{ $userEntry->notes }}</textarea>
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
                            <x-button wire:click="saveUserEntry" class="mt-auto">
                                Save
                            </x-button>
                            <x-button.secondary wire:click="deleteUserEntry" class="!w-max px-10">
                                Remove
                            </x-button.secondary>
                        </div>
                    </div>
        </div>
    @else
        <x-button wire:click="markAsComplete({{ $userEntry->id }})" type="submit" class="my-auto">
            Mark as complete
        </x-button>
    @endif
    @endif
</div>
@else
<div class="p-4 h-full flex flex-col justify-center">
    <x-button wire:click="imFeelingLucky">
        I'm feeling lucky
    </x-button>
</div>
@endif
</div>
