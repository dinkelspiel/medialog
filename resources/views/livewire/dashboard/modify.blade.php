<div class="px-96 scrollable-grid-item !max-h-screen pb-12">
    <div class="border-b border-stone-300 text-lg p-3 flex flex-row items-center">
        <div class="mr-auto">
            {{ $modifyMode }} Franchise
        </div>
    </div>
    <div class="p-3 flex flex-col gap-3">
        <div>
            Franchise Title
        </div>
        <input class="input" placeholder="Title" wire:model="franchiseName">
        <div>
            Category
        </div>
        <select class="input" wire:model="franchiseCategory">
            @foreach(\App\Models\Category::all() as $category)
                <option value="{{ $category->id }}">
                    {{ $category->name }}
                </option>
            @endforeach
        </select>
        <div class="flex items-center gap-3">
            <div class="mr-auto">
                Entries
            </div>
            <button wire:click="addEntry" class="small-btn">
                Add Entry
            </button>
        </div>
        @foreach ($this->entries as $entry)
            <div wire:key="{{ $loop->index }}" class="flex flex-col gap-3 mb-3 ps-3 border-s border-secondary">
                <div>
                    Entry Title
                </div>
                <div class="text-left text-neutral-400 text-xs pt-2 col-span-2">
                    Standalone movies/books should have their name as the entry name and series should have "Season 1", "Season 2" if no name is given
                </div>
                <input class="input" placeholder="Title" wire:model="entries.{{ $loop->index }}.name">
                <div>
                    Production Studio
                </div>
                <div class="flex flex-row gap-2 flex-wrap">
                    @foreach($this->entries[$loop->index]['studios'] as $studio)
                        <button class="max-w-max flex flex-row gap-1 bg-secondary text-white rounded-full px-3" wire:click="removeMeta('studios', {{ $loop->parent->index }}, '{{ $studio }}')">
                            {{ $studio }}
                        </button>
                    @endforeach
                </div>
                <div class="grid grid-cols-1 w-full relative">
                    <div class="flex flex-row gap-3 max-w-full">
                        <input class="input w-full @if($entries[$loop->index]['studioSearch'] != "") !rounded-bl-none !rounded-br-none @endif" placeholder="ABC Productions" wire:model.live="entries.{{ $loop->index }}.studioSearch">
                    </div>
                    @if($entries[$loop->index]['studioSearch'] != "")
                        <div class="dropdown-container">
                            @foreach(\App\Models\Studio::where('name', 'LIKE', '%' . $entries[$loop->index]['studioSearch'] . '%')->orderBy('name')->get() as $studio)
                                @if(!in_array($studio->name, $this->entries[$loop->parent->index]['studios']))
                                    <button class="dropdown-button" wire:click="addMeta('studios', {{ $loop->parent->index }}, '{{ $studio->name }}')">
                                        {{ $studio->name }}
                                    </button>
                                @endif
                            @endforeach
                            <button class="dropdown-button pt-3 border-t border-t-outline" wire:click="saveStudio({{ $loop->index }})">
                                Add Studio
                            </button>
                        </div>
                    @endif
                </div>
                <div>
                    Directors/Writers
                </div>
                <div class="flex flex-row gap-2 flex-wrap">
                    @foreach($this->entries[$loop->index]['creators'] as $creator)
                        <button class="max-w-max flex flex-row gap-1 bg-secondary text-white rounded-full px-3" wire:click="removeMeta('creators', {{ $loop->parent->index }}, '{{ $creator }}')">
                            {{ $creator }}
                        </button>
                    @endforeach
                </div>
                <div class="grid grid-cols-1 w-full relative">
                    <div class="flex flex-row gap-3 max-w-full">
                        <input class="input w-full @if($entries[$loop->index]['creatorSearch'] != "") !rounded-bl-none !rounded-br-none @endif" placeholder="John Smith" wire:model.live="entries.{{ $loop->index }}.creatorSearch">
                    </div>
                    @if($entries[$loop->index]['creatorSearch'] != "")
                        <div class="dropdown-container">
                            @foreach(\App\Models\Person::where('name', 'LIKE', '%' . $entries[$loop->index]['creatorSearch'] . '%')->orderBy('name')->get() as $person)
                                @if(!in_array($person->name, $this->entries[$loop->parent->index]['creators']))
                                    <button class="dropdown-button" wire:click="addMeta('creators', {{ $loop->parent->index }}, '{{ $person->name }}')">
                                        {{ $person->name }}
                                    </button>
                                @endif
                            @endforeach
                            <button class="dropdown-button pt-3 border-t border-t-outline" wire:click="savePerson({{ $loop->index }})">
                                Add Creator
                            </button>
                        </div>
                    @endif
                </div>
                <div>
                    Cover Image URL
                </div>
                <input class="input" placeholder="https://example.com/image.png" wire:model="entries.{{ $loop->index }}.cover_url">
            </div>
        @endforeach
    </div>
    <button class="btn" @if(count($entries) == 0) disabled @endif wire:click="save">
        Save
    </button>
    @if(count($entries) == 0)
        <div class="error mt-3">
            A franchise must have atleast one entry
        </div>
    @endif

    @if(session()->has('message'))
        <div class="success mt-3">
            {{ session('message') }}
        </div>
    @endif
    @if(session()->has('error'))
        <div class="error mt-3">
            {{ session('error') }}
        </div>
    @endif
</div>
