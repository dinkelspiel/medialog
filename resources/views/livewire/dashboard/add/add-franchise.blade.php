<div class="px-96 scrollable-grid-item !max-h-screen pb-12">
    <div class="border-b border-stone-300 text-lg p-3 flex flex-row items-center">
        <div class="mr-auto">
            Add Franchise
        </div>
    </div>
    <div class="p-3 flex flex-col gap-3">
        <div>
            Name
        </div>
        <input class="input" placeholder="Name" wire:model="franchiseName">
        <div>
            Category
        </div>
        <select class="input" wire:model="franchiseCategory">
            @foreach(\App\Models\Category::all()->pluck('name') as $category)
                <option>
                    {{ $category }}
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
                    Name
                </div>
                <input class="input" placeholder="Name" wire:model="entries.{{ $loop->index }}.name">
                <div>
                    Studio
                </div>
                <div class="flex flex-col gap-3 w-full">
                    <select class="input" wire:model="entries.{{ $loop->index }}.studio">
                        <option value="">
                            Select a studio
                        </option>
                        @foreach(\App\Models\Studio::all()->pluck('name') as $studio)
                            <option>
                                {{ $studio }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div>
                    Producers
                </div>
                @foreach($this->entries[$loop->index]['producers'] as $producer)
                    <div class="flex flex-row">
                        <div class="mr-auto">
                            {{ $producer }}
                        </div>
                        <div class="text-btn" wire:key="{{ $loop->index }}" wire:click="removeMeta('producers', {{ $loop->parent->index }}, '{{ $producer }}')">
                            Remove
                        </div>
                    </div>
                @endforeach
                <div class="flex flex-row gap-3 w-full">
                    <select class="input w-full" placeholder="Producers" wire:change="addMeta('producers', {{ $loop->index }}, $event.target.value)">
                        <option value="">
                            Select a producer
                        </option>
                        @foreach(\App\Models\Person::all()->pluck('name') as $person)
                            @if(!in_array($person, $this->entries[$loop->parent->index]['producers']))
                                <option>
                                    {{ $person }}
                                </option>
                            @endif
                        @endforeach
                    </select>
                    <button class="btn !w-32">Add</button>
                </div>
                <div>
                    Cast
                </div>
                @foreach($this->entries[$loop->index]['cast'] as $person => $characterName)
                    <div class="flex flex-col">
                        <div class="flex flex-row">
                            <div class="mr-auto">
                                {{ $person }}
                            </div>
                            <div class="text-btn" wire:key="{{ $loop->index }}" wire:click="removeCast({{ $loop->parent->index }}, '{{ $person }}')">
                                Remove
                            </div>
                        </div>
                        <div>
                            <input placeholder="Character Name" wire:model="entries.{{ $loop->parent->index }}.cast.{{ $person }}">
                        </div>
                    </div>
                @endforeach
                <div class="flex flex-row gap-3 w-full">
                    <select class="input w-full" placeholder="Cast" wire:change="addCast({{ $loop->index }}, $event.target.value)">
                        <option value="">
                            Select an actor
                        </option>
                        @foreach(\App\Models\Person::all()->pluck('name') as $person)
                            @if(!in_array($person, $this->entries[$loop->parent->index]['cast']))
                                <option>
                                    {{ $person }}
                                </option>
                            @endif
                        @endforeach
                    </select>
                    <button class="btn !w-32">Add</button>
                </div>
                <div>
                    Genres
                </div>
                @foreach($this->entries[$loop->index]['genres'] as $genre)
                    <div class="flex flex-row">
                        <div class="mr-auto">
                            {{ $genre }}
                        </div>
                        <div class="text-btn" wire:key="{{ $loop->index }}" wire:click="removeMeta('genres', {{ $loop->parent->index }}, '{{ $genre }}')">
                            Remove
                        </div>
                    </div>
                @endforeach
                <div class="flex flex-row gap-3 w-full">
                    <select class="input w-full" placeholder="Genres" wire:change="addMeta('genres', {{ $loop->index }}, $event.target.value)">
                        <option value="">
                            Select a genre
                        </option>
                        @foreach(\App\Models\Genre::all()->pluck('name') as $genre)
                            @if(!in_array($genre, $this->entries[$loop->parent->index]['genres']))
                                <option>
                                    {{ $genre }}
                                </option>
                            @endif
                        @endforeach
                    </select>
                    <button class="btn !w-32">Add</button>
                </div>
                <div>
                    Themes
                </div>
                @foreach($this->entries[$loop->index]['themes'] as $theme)
                    <div class="flex flex-row">
                        <div class="mr-auto">
                            {{ $theme }}
                        </div>
                        <div class="text-btn" wire:key="{{ $loop->index }}" wire:click="removeMeta('themes', {{ $loop->parent->index }}, '{{ $theme }}')">
                            Remove
                        </div>
                    </div>
                @endforeach
                <div class="flex flex-row gap-3 w-full">
                    <select class="input w-full" placeholder="Themes" wire:change="addMeta('themes', {{ $loop->index }}, $event.target.value)">
                        <option value="">
                            Select a theme
                        </option>
                        @foreach(\App\Models\Theme::all()->pluck('name') as $theme)
                            @if(!in_array($theme, $this->entries[$loop->parent->index]['themes']))
                                <option>
                                    {{ $theme }}
                                </option>
                            @endif
                        @endforeach
                    </select>
                    <button class="btn !w-32">Add</button>
                </div>
                <div>
                    Cover Image URL
                </div>
                <input class="input" placeholder="https://example.com/image.png" wire:model="entries.{{ $loop->index }}.cover_url">
                {{-- <button class="small-btn" wire:click="removeEntry({{ $loop->index }})">
                    Remove
                </button> --}}
            </div>
        @endforeach


        {{-- @foreach($entries as $entry)
             <livewire:dashboard.add.add-entry :entry="$entry" :key="$entry->id" />
        @endforeach --}}
    </div>
    <button class="btn" @if(count($entries) == 0) disabled @endif wire:click="save">
        Save
    </button>
    @if(count($entries) == 0)
        <div class="error mt-3">
            A franchise must have atleast one entry
        </div>
    @endif
</div>
