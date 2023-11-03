<div class="xl:mx-96 mx-0 py-3 flex flex-col gap-2 h-[calc(100dvh)]">
    <div class="grid gap-3 grid-cols-3">
        @foreach (\App\Models\ColorScheme::all() as $colorScheme)
            <div class="border c-border-outline rounded-lg p-3 flex flex-col gap-3">
                <div class="flex flex-col gap-1.5">
                    <div class="flex flex-row justify-between">
                        <div>
                            {{ $colorScheme->name }}
                        </div>
                        @if($colorScheme->creator_id == auth()->user()->id)
                            <button class="text-btn" wire:click="deleteColorScheme({{ $colorScheme->id }})">
                                Remove
                            </button>
                        @endif
                    </div>
                    <div class="text-sm">
                        By {{ $colorScheme->creator->username }}
                    </div>
                </div>
                <div class="grid grid-cols-2 h-40 rounded-lg">
                    <div style="background: {{ $colorScheme->background }}"></div>
                    <div style="background: {{ $colorScheme->card }}"></div>
                    <div style="background: {{ $colorScheme->card_hover }}"></div>
                    <div style="background: {{ $colorScheme->card_active }}"></div>
                    <div style="background: {{ $colorScheme->secondary }}"></div>
                    <div style="background: {{ $colorScheme->secondary_hover }}"></div>
                    <div style="background: {{ $colorScheme->secondary_active }}"></div>
                    <div style="background: {{ $colorScheme->outline }}"></div>
                    <div style="background: {{ $colorScheme->text }}"></div>
                    <div style="background: {{ $colorScheme->text_gray }}"></div>
                </div>
                <div class="flex flex-row gap-3">
                    @if ($colorScheme->creator_id == auth()->user()->id)
                        <div class="w-full flex justify-center items-center h-6 c-bg-card rounded-lg">
                            Owner
                        </div>
                    @endif
                    @if (auth()->user()->colorScheme && auth()->user()->colorScheme->id == $colorScheme->id)
                        <div class="w-full flex justify-center items-center h-6 c-bg-card rounded-lg">
                            Selected
                        </div>
                    @endif
                </div>
                <button class="small-btn btn-primary mt-auto" wire:click="pickColorScheme({{ $colorScheme->id }})">
                    @if (auth()->user()->colorScheme && auth()->user()->colorScheme->id == $colorScheme->id)
                        Disable
                    @else
                        Enable
                    @endif
                </button>
            </div>
        @endforeach
    </div>
</div>
