<div>
    @foreach($userEntries as $userEntry)
        <button wire:click="showUserEntry({{ $userEntry->id }})" class="h-20 w-full text-left rounded-lg duration-200 border-color hover:bg-card-hover active:rounded-xl active:bg-card-active hover:border-secondary border-dashed border p-3 flex flex-row cursor-pointer">
            @if(count($userEntry->entry->franchise->entries) > 0)
                <img src="{{ $userEntry->entry->cover_url }}" class="rounded-lg h-full w-28 object-cover">
            @else
                <img src="/assets/noimg.png" class="rounded-lg h-full w-28 object-cover">
            @endif
            
            <div class="ms-3 flex flex-col justify-center">
                <div class="text-xs text-slate-800">
                    {{ $userEntry->entry->name }}
                </div>
                <div class="text-base">
                    {{ $userEntry->entry->franchise->name }}   
                </div>
                <div class="text-sm text-slate-800">
                    {{ $userEntry->entry->studio->name }}
                </div>
            </div>  
        </button> 
    @endforeach
</div>
