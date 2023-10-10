<div class="scrollable-grid-item">
    @include("includes.admin.header")

    <div class="mt-3">
        <div class="flex flex-col gap-3 mx-96">
            <div class="grid grid-cols-4 items-center justify-center border-b border-b-slate-200 h-10 font-semibold">
                <div>
                    Franchise
                </div>
                <div>
                    Entries
                </div>
                <div>
                    Producers
                </div>
                <div>

                </div>
            </div>
            @foreach(\App\Models\Franchise::all() as $franchise)
                <div class="grid grid-cols-4 items-center justify-center @if($loop->index % 2 != 0) bg-slate-200 @endif">
                    <div>
                        {{ $franchise->name }}
                    </div>
                    <div>
                        {{ $franchise->entries->count() }}
                    </div>
                    <div>
                        {{ \App\Models\Franchise::with('entries.producers')->find($franchise->id)->entries->pluck('producers')->flatten(1)->unique('id')->count() }}
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
