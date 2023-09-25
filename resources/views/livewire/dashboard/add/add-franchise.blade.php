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
            @foreach(Category::all()->pluck('name') as $category)
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
                    <div id="studios">

                    </div>
                    <select class="input">
                        @foreach($studios as $studio)
                            <option>
                                {{ $studio->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div>
                    Producers
                </div>
                <div class="flex flex-row gap-3 w-full">
                    <input class="input w-full" placeholder="Producers">
                    <button class="small-btn w-32">Add</button>
                </div>
                <div>
                    Actors
                </div>
                <div class="flex flex-row gap-3 w-full">
                    <input class="input w-full" placeholder="Actors">
                    <button class="small-btn w-32">Add</button>
                </div>
                <div>
                    Genres
                </div>
                <div class="flex flex-row gap-3 w-full">
                    <input class="input w-full" placeholder="Genres">
                    <button class="small-btn w-32">Add</button>
                </div>
                <div>
                    Themes
                </div>
                <div class="flex flex-row gap-3 w-full">
                    <input class="input w-full" placeholder="Themes">
                    <button class="small-btn w-32">Add</button>
                </div>
                <div>
                    Cover Image URL
                </div>
                <input class="input" placeholder="https://web.com/image.png">
            </div>
        @endforeach


        @foreach($entries as $entry)
             <livewire:dashboard.add.add-entry :entry="$entry" :key="$entry->id" />
        @endforeach
    </div>
</div>
