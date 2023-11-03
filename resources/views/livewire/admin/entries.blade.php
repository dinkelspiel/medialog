<div class="scrollable-grid-item h-[calc(100dvh)]">
    @include('includes.admin.header')

    <div class="mt-3 h-[calc(100dvh)]">
        <div class="flex flex-col gap-3 lg:mx-40 mx-0">
            <div class="grid grid-cols-3">
                <div class="flex gap-2">
                    <div>
                        0 Entries
                    </div>
                    <input type="checkbox" wire:click="toggleShow0Entries"
                        @if ($show0Entries) checked @endif>
                </div>
                <div class="flex gap-2">
                    <div>
                        0 Creators
                    </div>
                    <input type="checkbox" wire:click="toggleShow0Creators"
                        @if ($show0Creators) checked @endif>
                </div>
                <div class="flex gap-2">
                    <div>
                        0 Studios
                    </div>
                    <input type="checkbox" wire:click="toggleShow0Studios"
                        @if ($show0Studios) checked @endif>
                </div>
            </div>
            <div class="grid grid-cols-5 items-center justify-center border-b border-b-outline  h-10 font-semibold">
                <div>
                    Franchise (id)
                </div>
                <div>
                    Entries
                </div>
                <div>
                    Creators
                </div>
                <div>
                    Studios
                </div>
                <div>

                </div>
            </div>
            @foreach (\App\Models\Franchise::all() as $franchise)
                @if (\App\Models\Franchise::with('entries.studios')->find($franchise->id)->entries->pluck('studios')->flatten(1)->unique('id')->count() == 0 || !$show0Studios)
                    @if (\App\Models\Franchise::with('entries.creators')->find($franchise->id)->entries->pluck('creators')->flatten(1)->unique('id')->count() == 0 || !$show0Creators)
                        @if ($franchise->entries->count() == 0 || !$show0Entries)
                            <div
                                class="grid grid-cols-5 items-center justify-center @if ($loop->index % 2 != 0) c-bg-card @endif">
                                <div>
                                    {{ $franchise->name }} ({{ $franchise->id }})
                                </div>
                                <div>
                                    {{ $franchise->entries->count() }}
                                </div>
                                <div>
                                    {{ \App\Models\Franchise::with('entries.creators')->find($franchise->id)->entries->pluck('creators')->flatten(1)->unique('id')->count() }}
                                </div>
                                <div>
                                    {{ \App\Models\Franchise::with('entries.studios')->find($franchise->id)->entries->pluck('studios')->flatten(1)->unique('id')->count() }}
                                </div>
                                <div>
                                    <a class="small-btn" href="/dashboard/edit/{{ $franchise->id }}">
                                        Edit
                                    </a>
                                </div>
                            </div>
                        @endif
                    @endif
                @endif
            @endforeach
        </div>
    </div>
</div>
