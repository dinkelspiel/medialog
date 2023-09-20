<div class="grid grid-cols-2 m-3 gap-3">
    <input wire:model.live="search" type="text" placeholder="Search franchise..." class="grid-item col-span-2 input"/>

    @if($search != "")
        <ul class="grid-item col-span-2 flex flex-col overflow-y-scroll no-scrollbar" style="height: calc(100vh - 12rem)">
            @foreach($entries as $entry)
                <li>
                    {{ dd($entry) }}
                    <button type="submit" wire:click="" class="h-20 w-full text-left rounded-lg duration-200 border-card hover:bg-card-hover active:rounded-xl active:bg-card-active hover:border-secondary border-dashed border p-3 flex flex-row cursor-pointer">
                        @if(count($entry->franchise->entries) > 0)
                            <img src="{{ $entry->cover_url }}" class="rounded-lg h-full w-28 object-cover">
                        @else
                            <img src="/assets/noimg.png" class="rounded-lg h-full w-28 object-cover">
                        @endif

                        <div class="ms-3 flex flex-col justify-center">
                            <div class="text-xs text-slate-800">
                                {{ $entry->name }}
                            </div>
                            <div class="text-base">
                                {{ $entry->franchise->name }}
                            </div>
                            <div class="text-sm text-slate-800">
                                {{ $entry->studio->name }}
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
            Enter a term to search for users.
        </div>
    @endif
</div>
