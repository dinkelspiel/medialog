<div class="px-96">
    <div class="border-b border-stone-300 text-lg p-3 flex flex-row items-center">
        <div class="mr-auto">
            Add Franchise
        </div>
    </div>
    <div class="p-3 flex flex-col gap-3">
        <div>
            Name
        </div>
        <input class="input" placeholder="Name" wire.model="franchiseName">
        <div>
            Category
        </div>
        <select class="input" wire.model="franchiseCategory">
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
            @if(count($entries) > 0)
                <button wire:click="removeEntry()" class="small-btn">
                    Remove Entry
                </button>
            @endif
        </div>
        @foreach ($entries as $entry)
            <div wire:key="{{ $loop->index }}" class="flex flex-col gap-3 mb-3 ps-3 border-s border-secondary">
                <div>
                    Name
                </div>
                <input class="input" placeholder="Name">
                <div>
                    Studio
                </div>
                <div class="flex flex-col gap-3 w-full">
                    <select class="input">
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
                @foreach($entries[$loop->index]['producers'] as $producer)
                    <div class="flex flex-row">
                        <div class="mr-auto">
                            {{ $producer }}
                        </div>
                        <div class="text-btn" wire:click="removeProducer({{ $loop->index }}, {{ $producer }})">
                            Remove
                        </div>
                    </div>
                @endforeach
                <div class="flex flex-row gap-3 w-full">
                    <select class="input w-full" placeholder="Producers" wire:change="addProducer({{ $loop->index }}, $event.target.value)">
                        @foreach(\App\Models\Person::all()->pluck('name') as $person)
                            <option>
                                {{ $person }}
                            </option>
                        @endforeach
                    </select>
                    <button class="btn !w-32">Add</button>
                </div>
                <div>
                    Cast
                </div>
                <div class="flex flex-row gap-3 w-full">
                    <input class="input w-full" placeholder="Cast">
                    <button class="btn !w-32">Add</button>
                </div>
                <div>
                    Genres
                </div>
                <div class="flex flex-row gap-3 w-full">
                    <input class="input w-full" placeholder="Genres">
                    <button class="btn !w-32">Add</button>
                </div>
                <div>
                    Themes
                </div>
                <div class="flex flex-row gap-3 w-full">
                    <input class="input w-full" placeholder="Themes">
                    <button class="btn !w-32">Add</button>
                </div>
                <div>
                    Cover Image URL
                </div>
                <input class="input" placeholder="https://example.com/image.png">
            </div>
        @endforeach


        {{-- @foreach($entries as $entry)
             <livewire:dashboard.add.add-entry :entry="$entry" :key="$entry->id" />
        @endforeach --}}
    </div>
</div>
