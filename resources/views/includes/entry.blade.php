@if(count($entry->franchise->entries) > 0)
    <img src="{{ $entry->cover_url }}" class="rounded-lg h-full w-28 object-cover">
@else
    <img src="/assets/noimg.png" class="rounded-lg h-full w-28 object-cover">
@endif

<div class="ms-3 flex flex-col justify-center" style="gap: -5px">
    @if(count($entry->franchise->entries) > 1)
        <div class="text-xs text-slate-800">
            {{ $entry->name }}
        </div>
    @endif
    <div class="text-base">
        {{ $entry->franchise->name }}
    </div>
    <div class="text-sm text-slate-800">
        @switch(auth()->user()->subtext_style->value)
            @case("studio")
                @foreach ($entry->studios()->distinct()->get() as $studio) <i>{{ $studio->name }}</i>@if($loop->remaining == 1) and @elseif(!$loop->last),@endif @endforeach
            @break
            @case("creator")
                @foreach ($entry->creators()->distinct()->get() as $creator) <i>{{ $creator->name }}</i>@if($loop->remaining == 1) and @elseif(!$loop->last),@endif @endforeach
            @break
        @endswitch
    </div>
</div>
