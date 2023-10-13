<div class="grid grid-cols-2 m-3 gap-2">
    <input wire:model.live="search" type="text" placeholder="Search franchise..." class="grid-item col-span-2 input" />

    <select class="col-span-2 input" wire:model.live="category">
        <option value="0">
            Select a Category
        </option>
        @foreach (\App\Models\Category::all() as $category)
            <option value="{{ $category->id }}">
                {{ $category->name }}
            </option>
        @endforeach
    </select>

    <div class="grid grid-cols-1 w-full relative" x-data="{ open: true }">
        <input class="input w-full @if (\App\Models\Studio::where('name', $searchStudio)->first() == null && $searchStudio != '') !border !border-red-400 @endif"
            placeholder="Production Studio" wire:model.live="searchStudio" @focus="open = true">
        @if ($searchStudio != '' && \App\Models\Studio::where('name', $searchStudio)->first() == null)
            <div class="dropdown-container" x-show="open">
                @foreach (\App\Models\Studio::where('name', 'LIKE', '%' . $searchStudio . '%')->orderBy('name')->get() as $studio)
                    <button class="dropdown-button" wire:click="setSearchStudio('{{ $studio->name }}')"
                        @click="open = false">
                        {{ $studio->name }}
                    </button>
                @endforeach
            </div>
        @endif
    </div>

    <div class="grid grid-cols-1 w-full relative" x-data="{ open: true }">
        <input class="input w-full @if (\App\Models\Person::where('name', $searchCreator)->first() == null && $searchCreator != '') !border !border-red-400 @endif"
            placeholder="Director/Writer" wire:model.live="searchCreator" @focus="open = true">
        @if ($searchCreator != '' && \App\Models\Person::where('name', $searchCreator)->first() == null)
            <div class="dropdown-container" x-show="open">
                @foreach (\App\Models\Person::where('name', 'LIKE', '%' . $searchCreator . '%')->orderBy('name')->get() as $person)
                    <button class="dropdown-button" wire:click="setSearchCreator('{{ $person->name }}')"
                        @click="open = false">
                        {{ $person->name }}
                    </button>
                @endforeach
            </div>
        @endif
    </div>

    @if (
        $search != '' ||
            ($searchStudio != '' && \App\Models\Studio::where('name', $searchStudio)->first() != null) ||
            ($searchCreator != '' && \App\Models\Person::where('name', $searchCreator)->first() != null))
        <ul class="grid-item col-span-2 flex flex-col overflow-y-scroll no-scrollbar"
            style="height: calc(100vh - 20rem)">
            @foreach ($entries as $entry)
                <li>
                    <button class="entry-container"
                        wire:click="create({{ $entry->franchise->id }}, {{ $entry->id }})">
                        @include('includes.entry', [
                            'entry' => $entry,
                        ])
                    </button>
                </li>
            @endforeach
            <a href="/dashboard/add"
                class="text-secondary dark:text-dark-secondary hover:text-secondary-hover dark:hover:text-dark-secondary-hover active:text-secondary-active dark:active:text-dark-secondary-active duration-100  text-sm text-center col-span-2 mt-6 mb-3 cursor-pointer">
                Does your franchise not exist? Add it
            </a>
        </ul>
    @else
        <div class="text-gray-500 text-sm">
            Enter a term to search for franchises.
        </div>
    @endif
</div>
