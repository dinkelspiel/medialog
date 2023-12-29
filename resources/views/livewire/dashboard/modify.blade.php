<div class="xl:mx-96 mx-0 min-h-[100dvh] pb-12">
    <div class="font-semibold text-xl flex flex-row mx-auto w-max items-center py-4">
        {{ $modifyMode }} Franchise
    </div>
    <div class="p-3 flex flex-col gap-4">
        <x-input placeholder="Franchise Title" wire:model="franchiseName" />
        <x-select wire:model="franchiseCategory">
            @foreach (\App\Models\Category::all() as $category)
                <option value="{{ $category->id }}">
                    {{ $category->name }}
                </option>
            @endforeach
        </x-select>
        <div class="flex items-center gap-3">
            <div class="mr-auto font-semibold text-xl">
                Entries
            </div>
            <x-button wire:click="addEntry" class="w-max px-24">
                Add Entry
            </x-button>
        </div>
        @foreach ($this->entries as $entry)
            <div wire:key="{{ $loop->index }}" class="flex flex-col gap-4 p-8 border-s-2 c-border-secondary ">
                <div class="text-left text-neutral-400 text-xs pt-2 col-span-2">
                    Standalone movies/books should have their name as the entry title and series should have "Season 1",
                    "Season 2" if no name is given
                </div>
                <x-input placeholder="Entry Title" wire:model="entries.{{ $loop->index }}.name" />
                @if (count($this->entries[$loop->index]['studios']) > 0)
                    <div class="flex flex-row gap-2 flex-wrap">
                        @foreach ($this->entries[$loop->index]['studios'] as $studio)
                            <button class="max-w-max flex flex-row gap-1 c-bg-secondary  text-white rounded-full px-3"
                                wire:click="removeMeta(`studios`, {{ $loop->parent->index }}, `{{ $studio }}`)">
                                {{ $studio }}
                            </button>
                        @endforeach
                    </div>
                @endif
                <div class="grid grid-cols-1 w-full relative">
                    <div class="flex flex-row gap-3 max-w-full">
                        <x-input class="w-full @if ($entries[$loop->index]['studioSearch'] != '')  @endif"
                            placeholder="Production Studio"
                            wire:model.live="entries.{{ $loop->index }}.studioSearch" />
                    </div>
                    @if ($entries[$loop->index]['studioSearch'] != '')
                        <x-dropdown.container>
                            @foreach (\App\Models\Studio::where('name', 'LIKE', '%' . $entries[$loop->index]['studioSearch'] . '%')->orderBy('name')->get() as $studio)
                                @if (!in_array($studio->name, $this->entries[$loop->parent->index]['studios']))
                                    <x-dropdown.button
                                        wire:click="addMeta('studios', {{ $loop->parent->index }}, `{{ $studio->name }}`)">
                                        {{ $studio->name }}
                                    </x-dropdown.button>
                                @endif
                            @endforeach
                            <x-dropdown.button class="pt-3 border-t c-border-t-outline "
                                wire:click="saveStudio({{ $loop->index }})">
                                Add Studio
                            </x-dropdown.button>
                        </x-dropdown.container>
                    @endif
                </div>
                @if (count($this->entries[$loop->index]['creators']) > 0)
                    <div class="flex flex-row gap-2 flex-wrap">
                        @foreach ($this->entries[$loop->index]['creators'] as $creator)
                            <button class="max-w-max flex flex-row gap-1 c-bg-secondary text-white rounded-full px-3"
                                wire:click="removeMeta(`creators`, {{ $loop->parent->index }}, `{{ $creator }}`)">
                                {{ $creator }}
                            </button>
                        @endforeach
                    </div>
                @endif
                <div class="w-full relative">
                    <div class="flex flex-row gap-3 max-w-full">
                        <x-input class="w-full @if ($entries[$loop->index]['creatorSearch'] != '')  @endif" placeholder="Director/Writer"
                            wire:model.live="entries.{{ $loop->index }}.creatorSearch" />
                    </div>
                    @if ($entries[$loop->index]['creatorSearch'] != '')
                        <x-dropdown.container>
                            @foreach (\App\Models\Person::where('name', 'LIKE', '%' . $entries[$loop->index]['creatorSearch'] . '%')->orderBy('name')->get() as $person)
                                @if (!in_array($person->name, $this->entries[$loop->parent->index]['creators']))
                                    <x-dropdown.button
                                        wire:click="addMeta('creators', {{ $loop->parent->index }}, `{{ $person->name }}`)">
                                        {{ $person->name }}
                                    </x-dropdown.button>
                                @endif
                            @endforeach
                            <x-dropdown.button class="pt-3 border-t c-border-t-outline "
                                wire:click="savePerson({{ $loop->index }})">
                                Add Creator
                            </x-dropdown.button>
                        </x-dropdown.container>
                    @endif
                </div>
                <x-input placeholder="https://example.com/image.png"
                    wire:model="entries.{{ $loop->index }}.cover_url" />
            </div>
        @endforeach
    </div>
    @if (count($entries) != 0)
        <x-button wire:click="save">
            Save
        </x-button>
    @else
        <x-button disabled wire:click="save">
            Save
        </x-button>
    @endif
    @if (count($entries) == 0)
        <div class="error mt-3">
            A franchise must have atleast one entry
        </div>
    @endif

    @if (session()->has('message'))
        <div class="success mt-3">
            {{ session('message') }}
        </div>
    @endif
    @if (session()->has('error'))
        <div class="error mt-3">
            {{ session('error') }}
        </div>
    @endif
</div>
