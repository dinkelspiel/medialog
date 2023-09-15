<div class="grid grid-cols-2 m-3 gap-3">
    <input wire:model.live="search" type="text" placeholder="Search franchise..." class="grid-item col-span-2 input"/>

    @if($search != "")
        <ul class="grid-item col-span-2 flex flex-col gap-3">
            @foreach($franchises as $franchise)
                @foreach($franchise->entries as $entry)
                    <li>
                        <form action="/api/user/1/entry" method="post">
                            <input type="hidden" name="franchise_id" value="{{ $franchise->id }}">
                            <input type="hidden" name="entry_id" value="{{ $entry->id }}">
                            <button class="h-20 w-full text-left rounded-lg duration-200 border-card hover:bg-card-hover active:rounded-xl active:bg-card-active hover:border-secondary border-dashed border p-3 flex flex-row cursor-pointer">
                                @if(count($franchise->entries) > 0)
                                    <img src="{{ $entry->cover_url }}" class="rounded-lg h-full w-28 object-cover">
                                @else
                                    <img src="/assets/noimg.png" class="rounded-lg h-full w-28 object-cover">
                                @endif
                                
                                <div class="ms-3 flex flex-col justify-center">
                                    <div class="text-xs text-slate-800">
                                        {{ $entry->name }}
                                    </div>
                                    <div class="text-base">
                                        {{ $franchise->name }}   
                                    </div>
                                    <div class="text-sm text-slate-800">
                                        {{ $entry->studio->name }}
                                    </div>
                                </div>  
                            </button> 
                        </form>         
                    </li>
                @endforeach
            @endforeach
        </ul>
    @else
        <div class="text-gray-500 text-sm">
            Enter a term to search for users.
        </div>
    @endif
</div>