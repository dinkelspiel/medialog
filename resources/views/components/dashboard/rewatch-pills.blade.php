<div class="flex flex-row flex-wrap gap-4 justify-center items-center">
    @foreach (\App\Models\UserEntry::where('entry_id', $entryId)->where('user_id', auth()->user()->id)->get() as $uEntry)
        <button wire:click="showUserEntry({{ $uEntry->id }}, false)"
            class="h-[19px] py-0.5 px-[10px] text-xs rounded-full font-medium flex items-center @if ($uEntry->id === $currentUserEntryId) c-bg-secondary c-text-background @else c-bg-none border c-border-outline cursor-pointer @endif">
            @if ($uEntry->status === \App\Enums\UserEntryStatusEnum::Completed)
                {{ Carbon\Carbon::parse($uEntry->watched_at)->diffForHumans() }}
            @else
                Currently Watching
            @endif
        </button>
    @endforeach
    @if (!\App\Models\UserEntry::where('entry_id', $entryId)->where('user_id', auth()->user()->id)->where('status', '!=', 'completed')->exists())
        @isset($showAdd)
            <x-icons.plus class="c-fill-text h-[14px] cursor-pointer" wire:click="addRewatchToUserEntry" />
        @endisset
    @endif
</div>
