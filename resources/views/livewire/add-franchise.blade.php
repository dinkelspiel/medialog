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
        <input class="input" placeholder="Name">
        <div>
            Category
        </div>
        <select class="input">
            @foreach($categories as $category)
                <option>
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
            @if(count($entries) > 0)
                <button wire:click="removeEntry()" class="small-btn">
                    Remove Entry
                </button>
            @endif
        </div>
        @foreach ($entries as $entry)
            <div wire:key="{{ $loop->index }}" class="flex flex-col gap-3 ps-3 border-s border-secondary">
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
                    <select class="input" onchange="updateStudios(event)">
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
        @if(count($entries) > 0)
            <button class="small-btn" wire:click="$dispatch('openAddStudio')">
                Add Studio
            </button>
        @endif
    </div>
    <script>
        function updateStudios(event)
        {
            let studios = document.getElementById('studios');

            studios.innerHTML += `
                <div class="flex flex-row">
                    &#x2022; ${event.target.value}
                    <div class="ms-auto text-btn">
                        Remove
                    </div>
                </div>
`;

            console.log(studios.innerHTML)
        }
    </script>
</div>