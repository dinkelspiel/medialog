<div class="grid h-[calc(100dvh)] grid-cols-1 lg:grid-cols-[0.9fr,1.2fr,0.9fr] relative">
    <div class="grid-item my-3 rounded-lg c-bg-card  scrollable-grid-item" x-data="{ page: 'add' }">
        <div class="grid h-16 border-b c-border-b-outline " style="grid-template-columns: 1fr 1fr">
            <button x-on:click='page = "add"' :class="{ 'c-bg-outline': page === 'add' }"
                class="grid-item flex justify-center items-center text-lg font-medium cursor-pointer c-hover-bg-secondary-hover  c-active-bg-secondary-active  duration-100 rounded-tl-lg border-r c-border-r-outline ">
                Add
            </button>
            <button x-on:click='page = "filter"' :class="{ 'c-bg-outline': page === 'filter' }"
                class=" grid-item flex justify-center items-center text-lg font-medium cursor-pointer c-hover-bg-secondary-hover  c-active-bg-secondary-active  duration-100 rounded-tr-lg">
                Filter
            </button>
        </div>
        <div x-show="page == 'add'">
            <livewire:dashboard.search-franchise />
        </div>
        <div class="grid grid-cols-2 gap-2 p-3" x-show="page == 'filter'">
            {{-- Filter Options --}}
            <input class="input input-primary col-span-2" placeholder="Title" type="text"
                wire:model.live="filterTitle">
            <input class="input input-primary col-span-2" placeholder="Season" type="text"
                wire:model.live="filterSeason">

            <div class="grid grid-cols-1 w-full relative" x-data="{ open: true }">
                <input
                    class="input input-primary w-full @if (\App\Models\Studio::where('name', $filterSearchStudio)->first() == null && $filterSearchStudio != '') !border !border-red-400 @endif"
                    placeholder="Production Studio" wire:model.live="filterSearchStudio" @focus="open = true">
                @if ($filterSearchStudio != '' && $filterStudio == '0')
                    <div class="dropdown-container" x-show="open">
                        @foreach (\App\Models\Studio::where('name', 'LIKE', '%' . $filterSearchStudio . '%')->orderBy('name')->get() as $studio)
                            <button class="dropdown-button" wire:click="setFilterStudio(`{{ $studio->name }}`)"
                                @click="open = false">
                                {{ $studio->name }}
                            </button>
                        @endforeach
                    </div>
                @endif
            </div>

            <div class="grid grid-cols-1 w-full relative" x-data="{ open: true }">
                <input
                    class="input input-primary w-full @if (\App\Models\Person::where('name', $filterSearchCreator)->first() == null && $filterSearchCreator != '') !border !border-red-400 @endif"
                    placeholder="Director/Writer" wire:model.live="filterSearchCreator" @focus="open = true">
                @if ($filterSearchCreator != '' && $filterCreator == 0)
                    <div class="dropdown-container" x-show="open">
                        @foreach (\App\Models\Person::where('name', 'LIKE', '%' . $filterSearchCreator . '%')->orderBy('name')->get() as $person)
                            <button class="dropdown-button" wire:click="setFilterCreator(`{{ $person->name }}`)"
                                @click="open = false">
                                {{ $person->name }}
                            </button>
                        @endforeach
                    </div>
                @endif
            </div>

            <select class="input input-primary col-span-2" wire:model.live="filterCategory" placeholder="Category">
                <option value="0">
                    Select a Category
                </option>
                @foreach (\App\Models\Category::all() as $category)
                    <option value="{{ $category->id }}">
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>

            {{-- I'm Feeling Lucky --}}
            <button class="btn btn-primary col-span-2 mt-3"
                @if (!$canGetRandom) disabled @else wire:click="getRandom" @endif>
                I'm feeling lucky
            </button>
            <div class="text-left text-neutral-400 text-xs pt-2 col-span-2">
                Get a random media from Medialog with the given parameters
            </div>

            <div class="flex flex-row gap-2">
                <div>
                    Include all franchises
                </div>
                <input type="checkbox" wire:click="toggleIncludeAllFranchises"
                    @if ($includeAllFranchises) checked @endif>
            </div>
            <div class="flex flex-row gap-2">
                <div>
                    Include already watched
                </div>
                <input type="checkbox" wire:click="toggleIncludeAlreadyWatched"
                    @if ($includeAlreadyWatched) checked @endif>
            </div>

            {{-- I'm Feeling Lucky Result --}}
            @if (!$canGetRandom)
                <div class="error mt-3 col-span-2">
                    You must have atleast one un-completed franchise
                </div>
            @endif
            @if (!is_null($franchise))
                <div class="pt-6 rounded-lg object-cover flex flex-row gap-3 col-span-2">
                    <img src="{{ $franchise->entries->first()->cover_url }}" class="rounded-lg w-40 h-60 object-cover">
                    <div class="flex flex-col gap-3">
                        <div class="font-semibold">
                            <i>{{ $franchise->name }}</i>.
                        </div>
                        <div>
                            A <i>{{ $franchise->category->name }}</i> directed/written by

                            @php
                                $uniquecreators = $franchise->entries
                                    ->flatMap(function ($entry) {
                                        return $entry->creators;
                                    })
                                    ->unique('id');
                            @endphp

                            @foreach ($uniquecreators as $creator)
                                <i>{{ $creator->name }}</i>
                                @if ($loop->remaining == 1)
                                    and
                                @elseif(!$loop->last)
                                    ,
                                @endif
                            @endforeach
                        </div>
                        <div>
                            @php
                                $uniqueStudios = \App\Models\Franchise::with('entries.studios')
                                    ->find($franchise->id)
                                    ->entries->pluck('studios')
                                    ->collapse()
                                    ->unique('id');
                            @endphp

                            Studios include @foreach ($uniqueStudios as $studio)
                                <i>{{ $studio->name }}</i>
                                @if ($loop->remaining == 1)
                                    and
                                @elseif(!$loop->last)
                                    ,
                                @endif
                            @endforeach
                        </div>
                    </div>
                </div>
            @endif

            {{-- Sort After --}}
            <div class="my-6 pt-6 border-t w-full c-border-t-outline  border-dashed col-span-2">
                <div class="pb-1">
                    Sort After
                </div>
                <select class="input input-primary w-full" placeholder="Sort After"
                    wire:change="setSortAfter($event.target.value)">
                    @foreach ($sortAfterArray as $sort)
                        <option>
                            {{ $sort }}
                        </option>
                    @endforeach
                </select>
            </div>
        </div>
    </div>
    <div class="grid-item m-3 flex flex-col scrollable-grid-item no-scrollbar">
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
        <div class="my-3 rounded-lg c-bg-card  p-3 flex flex-col absolute z-10 w-full lg:relative" style="height: 98%">
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
