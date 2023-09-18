<div>
    <div class="grid h-16 border-b border-b-outline" style="grid-template-columns: 1fr 1fr">
        <button wire:click="setPage('add')" class="@if($page == 'add') bg-outline @endif grid-item flex justify-center items-center text-lg font-medium cursor-pointer hover:bg-secondary-hover active:bg-secondary-active duration-100 rounded-tl-lg border-r border-r-outline">
            Add
        </button>
        <button wire:click="setPage('filter')" class="@if($page == 'filter') bg-outline @endif grid-item flex justify-center items-center text-lg font-medium cursor-pointer hover:bg-secondary-hover active:bg-secondary-active duration-100 rounded-tr-lg">
            Filter
        </button>
    </div>
    @if($page == 'add')
        <livewire:dashboard.search-franchise /> 
    @elseif($page == 'filter')
        <livewire:dashboard.filter-user-entries-browser />
    @else
        <div>   
            Invalid page
        </div>
    @endif
</div>
