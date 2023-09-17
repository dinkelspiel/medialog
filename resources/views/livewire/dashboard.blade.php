<div class="grid h-screen" style="grid-template-columns: 0.9fr 1.2fr 0.9fr">
    <div class="grid-item my-3 rounded-lg bg-card">
        @include('dashboard/includes/add')
    </div>
    <div class="grid-item m-3 flex flex-col scrollable-grid-item no-scrollbar">
        <livewire:user-entries-browser /> 
    </div>
    @if($showUserEntry)
        <div class="grid-item my-3 rounded-lg bg-card scrollable-grid-item">
            <livewire:user-entry :userEntryId="$userEntryId" :key="$userEntryId" />
        </div>
    @endif
</div>