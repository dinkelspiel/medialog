<div class="scrollable-grid-item h-[calc(100dvh)]">
    @include('includes.admin.header')

    <div class="mt-3 h-[calc(100dvh)]">
        <div class="flex flex-col gap-3 lg:mx-40 mx-0">
            <div
                class="grid grid-cols-5 items-center justify-center border-b border-b-outline dark:border-b-dark-outline h-10 font-semibold">
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
                <div
                    class="grid grid-cols-5 items-center justify-center @if ($loop->index % 2 != 0) bg-card dark:bg-dark-card @endif">
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
            @endforeach
        </div>
    </div>
</div>
