<div class="xl:mx-96 mx-0 scrollable-grid-item min-h-[100dvh] pb-12">
    <div class="border-b c-border-outline  text-lg p-3 flex flex-row items-center">
        <div class="mr-auto">
            {{ $modifyMode }} Franchise
        </div>
    </div>
    <div class="p-3 flex flex-col gap-3">
        <div>
            Franchise Title
        </div>
        <x-input placeholder="Title" wire:model="franchiseName" />
        <div>
            Category
        </div>
        <x-select wire:model="franchiseCategory">
            @foreach (\App\Models\Category::all() as $category)
                <option value="{{ $category->id }}">
                    {{ $category->name }}
                </option>
            @endforeach
        </x-select>
        <div class="flex items-center gap-3">
            <div class="mr-auto">
                Entries
            </div>
            <button wire:click="addEntry" class="small-btn">
                Add Entry
            </button>
        </div>
        @foreach ($this->entries as $entry)
            <div wire:key="{{ $loop->index }}" class="flex flex-col gap-3 mb-3 ps-3 border-s c-border-secondary ">
                <div>
                    Entry Title
                </div>
                <div class="text-left text-neutral-400 text-xs pt-2 col-span-2">
                    Standalone movies/books should have their name as the entry name and series should have "Season 1",
                    "Season 2" if no name is given
                </div>
                <x-input placeholder="Title" wire:model="entries.{{ $loop->index }}.name" />
                <div>
                    Production Studio
                </div>
                <div class="flex flex-row gap-2 flex-wrap">
                    @foreach ($this->entries[$loop->index]['studios'] as $studio)
                        <button class="max-w-max flex flex-row gap-1 c-bg-secondary  text-white rounded-full px-3"
                            wire:click="removeMeta(`studios`, {{ $loop->parent->index }}, `{{ $studio }}`)">
                            {{ $studio }}
                        </button>
                    @endforeach
                </div>
                <div class="grid grid-cols-1 w-full relative">
                    <div class="flex flex-row gap-3 max-w-full">
                        <x-input
                            class="w-full @if ($entries[$loop->index]['studioSearch'] != '') !rounded-bl-none !rounded-br-none @endif"
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
                            <x-dropdown.button class="pt-3 border-t border-t-outline "
                                wire:click="saveStudio({{ $loop->index }})">
                                Add Studio
                            </x-dropdown.button>
                        </x-dropdown.container>
                    @endif
                </div>
                <div>
                    Directors/Writers
                </div>
                <div class="flex flex-row gap-2 flex-wrap">
                    @foreach ($this->entries[$loop->index]['creators'] as $creator)
                        <button class="max-w-max flex flex-row gap-1 bg-secondary  text-white rounded-full px-3"
                            wire:click="removeMeta(`creators`, {{ $loop->parent->index }}, `{{ $creator }}`)">
                            {{ $creator }}
                        </button>
                    @endforeach
                </div>
                <div class="grid grid-cols-1 w-full relative">
                    <div class="flex flex-row gap-3 max-w-full">
                        <x-input
                            class="w-full @if ($entries[$loop->index]['creatorSearch'] != '') !rounded-bl-none !rounded-br-none @endif"
                            placeholder="Director/Writer"
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
                            <x-dropdown.button class="pt-3 border-t border-t-outline "
                                wire:click="savePerson({{ $loop->index }})">
                                Add Creator
                            </x-dropdown.button>
                        </x-dropdown.container>
                    @endif
                </div>
                <div>
                    Cover Image URL
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
