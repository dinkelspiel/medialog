<div class="grid grid-cols-2 m-3 gap-2">
    <input wire:model.live="search" type="text" placeholder="Search franchise..." class="grid-item col-span-2 input"/>

    <select class="col-span-2 input" wire:model.live="category">
        <option value="0">
            Select a Category
        </option>
        @foreach(\App\Models\Category::all() as $category)
            <option value="{{ $category->id }}">
                {{ $category->name }}
            </option>
        @endforeach
    </select>

    <select class="input" wire:model.live="studio">
        <option value="0">
            Select a Studio
        </option>
        @foreach(\App\Models\Studio::all() as $studio)
            <option value="{{ $studio->id }}">
                {{ $studio->name }}
            </option>
        @endforeach
    </select>
    <select class="input" wire:model.live="creator">
        <option value="0">
            Select a director/writer
        </option>
        @foreach(\App\Models\Person::all() as $person)
            <option value="{{ $person->id }}">
                {{ $person->name }}
            </option>
        @endforeach
    </select>

    @if($search != "" || $this->studio != "0")
        <ul class="grid-item col-span-2 flex flex-col overflow-y-scroll no-scrollbar" style="height: calc(100vh - 20rem)">
            @foreach($entries as $entry)
                <li>
                    <button wire:click="create({{ $entry->franchise->id }}, {{ $entry->id }})" class="h-20 w-full text-left rounded-lg duration-200 border-card hover:bg-card-hover active:rounded-xl active:bg-card-active hover:border-secondary border-dashed border p-3 flex flex-row cursor-pointer">
                        @if(count($entry->franchise->entries) > 0)
                            <img src="{{ $entry->cover_url }}" class="rounded-lg h-full w-28 object-cover">
                        @else
                            <img src="/assets/noimg.png" class="rounded-lg h-full w-28 object-cover">
                        @endif

                        <div class="ms-3 flex flex-col justify-center">
                            @if(count($entry->franchise->entries) > 1)
                                <div class="text-xs text-slate-800">
                                    {{ $entry->name }}
                                </div>
                            @endif
                            <div class="text-base">
                                {{ $entry->franchise->name }}
                            </div>
                            <div class="text-sm text-slate-800">
                                @foreach ($entry->studios()->distinct()->get() as $studio) <i>{{ $studio->name }}</i>@if($loop->remaining == 1) and @elseif(!$loop->last),@endif @endforeach
                            </div>
                        </div>
                    </button>
                </li>
            @endforeach
            <a href="/dashboard/add" class="text-secondary hover:text-secondary-hover active:text-secondary-active duration-100  text-sm text-center col-span-2 mt-6 mb-3 cursor-pointer">
                Does your franchise not exist? Add it
            </a>
        </ul>
    @else
        <div class="text-gray-500 text-sm">
            Enter a term to search for franchises.
        </div>
    @endif
</div>
