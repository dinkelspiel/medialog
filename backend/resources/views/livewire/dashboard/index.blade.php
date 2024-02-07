<div
    class="grid h-[calc(100dvh-80px)] lg:h-[100dvh] grid-cols-1 lg:grid-cols-[0.9fr,1.2fr,0.9fr] gap-0 lg:gap-8 relative pb-8 pt-0 lg:pt-8">
    <div class="rounded-[32px] scrollable-grid-item c-shadow-card hidden lg:block">
        <livewire:dashboard.search-franchise />
    </div>
    <div x-data="{ open: false }" class="block lg:hidden">
        <button x-on:click="open = true"
            class="rounded-full h-[54px] w-[54px] c-bg-secondary flex items-center justify-center fixed bottom-12 right-[20px] c-shadow-card">
            <x-icons.plus class="c-fill-background" />
        </button>
        <div x-show="open">
            <div class="fixed z-30 top-0 left-0 w-[100dvw] h-[100dvh] bg-black opacity-50 lg:hidden">

            </div>
            <div
                class="rounded-[32px] scrollable-grid-item c-bg-card flex flex-col gap-4 fixed z-40 bottom-3 h-max min-h-[97dvh] w-[calc(100dvw-26px)] lg:bottom-0 lg:relative lg:h-full">
                <livewire:dashboard.search-franchise />
                <button x-on:click="open = false"
                    class="right-12 top-12 fixed text-secondary  hover:text-secondary-hover active:text-secondary-active duration-100 cursor-pointer">
                    <x-icons.xmark />
                </button>
            </div>
        </div>
    </div>
    <div class="flex flex-col lg:scrollable-grid-item no-scrollbar pb-8 px-2">
        <div x-data="{ open: false }" class="relative">
            <div class="font-semibold text-xl flex flex-row justify-between items-center py-4">
                My Media

                <div class="flex row gap-4">
                    <x-button.secondary class="!w-max px-4 md:px-8 flex flex-row items-center gap-3"
                        wire:click="cycleSortAfter">
                        @switch($sortAfter)
                            @case('Watched')
                                <x-icons.eye />
                                <div class="hidden md:block">
                                    Watched
                                </div>
                            @break

                            @case('Updated')
                                <x-icons.clock />
                                <div class="hidden md:block">
                                    Updated
                                </div>
                            @break

                            @case('Rating')
                                <x-icons.star />
                                <div class="hidden md:block">
                                    Rating
                                </div>
                            @break

                            @case('A-Z')
                                <x-icons.az />
                                <div class="hidden md:block">
                                    A-Z
                                </div>
                            @break

                            @default
                        @endswitch
                    </x-button.secondary>
                    <x-icons.circle class="c-active:bg-card-hover cursor-pointer" x-on:click="open = !open">
                        <x-icons.sort />
                    </x-icons.circle>
                </div>
            </div>
            <div x-show="open"
                class="rounded-[32px] border-2 c-border-card c-shadow-card grid grid-cols-2 gap-4 p-[30px] mb-8 absolute z-5 w-full top-0 c-bg-background">

                <div class="font-semibold text-xl text-center col-span-2 grid grid-cols-3">
                    <div>

                    </div>
                    <div>
                        Filter
                    </div>
                    <div class="flex flex-row justify-end">
                        <button x-on:click="open = false">
                            <x-icons.xmark />
                        </button>
                    </div>
                </div>

                {{-- Filter Options --}}
                <div class="flex flex-row gap-4 items-center w-full col-span-2">
                    <div class="px-2">
                        <x-icons.search />
                    </div>
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
                    <x-entry :entry="$browserEntry->entry" :rating="$browserEntry->getLatestCompleted()->rating" wire:click="showUserEntry({{ $browserEntry->id }})" />
                @endif
            @endforeach
        </div>
    </div>
    @if ($userEntry)
        <div class="fixed z-30 top-0 left-0 w-[100dvw] h-[100dvh] bg-black opacity-50 lg:hidden">

        </div>
        <div
            class="rounded-[32px] scrollable-grid-item flex flex-col gap-4 fixed z-40 bottom-3 h-max min-h-[97dvh] lg:min-h-0 w-[calc(100dvw-26px)] lg:w-full lg:bottom-0 lg:relative lg:h-full c-bg-background border-2 c-border-card c-shadow-card p-[30px]">
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
                @if ($userEntry->status === \App\Enums\UserEntryStatusEnum::Completed)
                    <div class="flex flex-col gap-3 h-full flex-1">
                        <x-dashboard.rewatch-pills :entryId="$userEntry->entry->id" :currentUserEntryId="$userEntry->id" showAdd />

                        <div id="rating-label" class="font-semibold">
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
                        <div class="font-semibold">
                            Notes
                        </div>
                        <textarea class="w-full appearance-none c-bg-background !h-full resize-none !text-base p-0 flex-1" name="notes"
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
        <div class="flex flex-col gap-4 h-full flex-1">
            <x-dashboard.rewatch-pills :entryId="$userEntry->entry->id" :currentUserEntryId="$userEntry->id" />

            <x-dashboard.status label="Planning" icon="bookmark" wire:click="setUserEntryStatus('planning')"
                :selected="$userEntry->status === \App\Enums\UserEntryStatusEnum::Planning" />
            <x-dashboard.status :label="$userEntry->entry->franchise->category->name == 'Book' ? 'Reading' : 'Watching'" icon="eye" wire:click="setUserEntryStatus('watching')"
                :selected="$userEntry->status === \App\Enums\UserEntryStatusEnum::Watching" />
            @if ($userEntry->status === \App\Enums\UserEntryStatusEnum::Watching)
                <x-dashboard.user-entry-data :userEntry="$userEntry" canChange
                    wire:change="updateUserEntryProgress(event.target.value)" />
            @endif
            <x-dashboard.status label="Paused" icon="pause" wire:click="setUserEntryStatus('paused')"
                :selected="$userEntry->status === \App\Enums\UserEntryStatusEnum::Paused" />
            @if ($userEntry->status === \App\Enums\UserEntryStatusEnum::Paused)
                <x-dashboard.user-entry-data :userEntry="$userEntry" />
            @endif
            <x-dashboard.status label="Did not finish" icon="xmark" wire:click="setUserEntryStatus('dnf')"
                :selected="$userEntry->status === \App\Enums\UserEntryStatusEnum::DNF" />
            @if ($userEntry->status === \App\Enums\UserEntryStatusEnum::DNF)
                <x-dashboard.user-entry-data :userEntry="$userEntry" />
            @endif
            <x-dashboard.status label="Completed" icon="flag-checkered" wire:click="setUserEntryStatus('completed')"
                :selected="$userEntry->status === \App\Enums\UserEntryStatusEnum::Completed" />
            <x-button.secondary class="mt-auto" wire:click="deleteUserEntry">
                Remove
            </x-button.secondary>
        </div>
    @endif
    @endif
</div>
@else
<div class="p-4 h-full hidden lg:block">
    <x-button wire:click="imFeelingLucky" class=" !h-[54px]">
        I'm feeling lucky
    </x-button>
</div>
@endif
</div>
