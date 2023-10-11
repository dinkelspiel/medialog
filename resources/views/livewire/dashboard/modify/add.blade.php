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
                    creators
                </div>
                @foreach($this->entries[$loop->index]['creators'] as $creator)
                    <div class="flex flex-row">
                        <div class="mr-auto">
                            {{ $creator }}
                        </div>
                        <div class="text-btn" wire:key="{{ $loop->index }}" wire:click="removeMeta('creators', {{ $loop->parent->index }}, '{{ $creator }}')">
                            Remove
                        </div>
                    </div>
                @endforeach
                <div class="flex flex-row gap-3 w-full">
                    <select class="input w-full" placeholder="creators" wire:change="addMeta('creators', {{ $loop->index }}, $event.target.value)">
                        <option value="">
                            Select a director/writer
                        </option>
                        @foreach(\App\Models\Person::all()->pluck('name') as $person)
                            @if(!in_array($person, $this->entries[$loop->parent->index]['creators']))
                                <option>
                                    {{ $person }}
                                </option>
                            @endif
                        @endforeach
                    </select>
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

    <div class="grid grid-cols-2 gap-3 mt-6">
        <div>
            <div class="border-b border-stone-300 text-lg p-3 flex flex-row items-center">
                <div class="mr-auto">
                    Add Person
                </div>
            </div>
            <div class="p-3 flex flex-col gap-3">
                <div>
                    Name
                </div>
                <input class="input" placeholder="Name" wire:model="addPersonName">
            </div>
            <button class="btn" wire:click="savePerson">
                Save
            </button>
        </div>
        <div>
            <div class="border-b border-stone-300 text-lg p-3 flex flex-row items-center">
                <div class="mr-auto">
                    Add Studio
                </div>
            </div>
            <div class="p-3 flex flex-col gap-3">
                <div>
                    Name
                </div>
                <input class="input" placeholder="Name" wire:model="addStudioName">
            </div>
            <button class="btn" wire:click="saveStudio">
                Save
            </button>
        </div>
    </div>
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
