<div class="c-bg-card rounded-[32px] border-2 c-border-card min-h-full no-scrollbar">
    <div class="grid grid-cols-2 gap-4 c-bg-background rounded-[32px] p-[30px]">
        <div class="font-semibold col-span-2 text-center text-xl">
            Add Media
        </div>
        <div class="flex flex-row gap-4 items-center w-full col-span-2">
            <div class="px-2">
                <x-icons.search />
            </div>
            <x-input wire:model.live="search" type="text" placeholder="Search franchise..." class="flex-grow" />
        </div>

        <x-select class="col-span-2" wire:model.live="category">
            <option value="0">
                Select a Category
            </option>
            @foreach (\App\Models\Category::all() as $category)
                <option value="{{ $category->id }}">
                    {{ $category->name }}
                </option>
            @endforeach
        </x-select>

        <div class="grid grid-cols-1 w-full relative" x-data="{ open: true }">
            <x-input placeholder="Production Studio" wire:model.live="searchStudio" @focus="open = true" />
            @if ($searchStudio != '' && \App\Models\Studio::where('name', $searchStudio)->first() == null)
                <x-dropdown.container x-show="open">
                    @foreach (\App\Models\Studio::where('name', 'LIKE', '%' . $searchStudio . '%')->orderBy('name')->get() as $studio)
                        <x-dropdown.button wire:click="setSearchStudio('{{ $studio->name }}')" @click="open = false">
                            {{ $studio->name }}
                        </x-dropdown.button>
                    @endforeach
                </x-dropdown.container>
            @endif
        </div>

        <div class="grid grid-cols-1 w-full relative" x-data="{ open: true }">
            <x-input placeholder="Director/Writer" wire:model.live="searchCreator" @focus="open = true" />
            @if ($searchCreator != '' && \App\Models\Person::where('name', $searchCreator)->first() == null)
                <x-dropdown.container x-show="open">
                    @foreach (\App\Models\Person::where('name', 'LIKE', '%' . $searchCreator . '%')->orderBy('name')->get() as $person)
                        <x-dropdown.button wire:click="setSearchCreator('{{ $person->name }}')" @click="open = false">
                            {{ $person->name }}
                        </x-dropdown.button>
                    @endforeach
                </x-dropdown.container>
            @endif
        </div>
    </div>
    <div class="overflow-y-scroll p-[30px] max-h-full">
        @if (
            $search != '' ||
                ($searchStudio != '' && \App\Models\Studio::where('name', $searchStudio)->first() != null) ||
                ($searchCreator != '' && \App\Models\Person::where('name', $searchCreator)->first() != null))
            <ul>
                @foreach ($entries as $entry)
                    <li>
                        <x-entry :entry="$entry" wire:click="create({{ $entry->franchise->id }}, {{ $entry->id }})"
                            class="c-border-card" />
                    </li>
                @endforeach
                <a href="/dashboard/add"
                    class="c-text-secondary  c-active:text-secondary-hover  c-active:text-secondary-active  duration-100  text-sm text-center col-span-2 mt-6 mb-3 cursor-pointer">
                    Does your franchise not exist? Add it
                </a>
            </ul>
        @else
            <div class="text-gray-500 text-sm">
                Enter a term to search for franchises.
            </div>
        @endif
    </div>
</div>
