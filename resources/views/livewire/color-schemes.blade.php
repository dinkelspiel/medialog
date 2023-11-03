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
                <div class="grid grid-cols-2 h-40 rounded-lg text-black">
                    <div style="background: {{ $colorScheme->background }}" class="flex justify-center items-center">Background</div>
                    <div style="background: {{ $colorScheme->card }}" class="flex justify-center items-center">Card</div>
                    <div style="background: {{ $colorScheme->card_hover }}" class="flex justify-center items-center">Card Hover</div>
                    <div style="background: {{ $colorScheme->card_active }}" class="flex justify-center items-center">Card Active</div>
                    <div style="background: {{ $colorScheme->secondary }}" class="flex justify-center items-center">Secondary</div>
                    <div style="background: {{ $colorScheme->secondary_hover }}" class="flex justify-center items-center">Secondary Hover</div>
                    <div style="background: {{ $colorScheme->secondary_active }}" class="flex justify-center items-center">Secondary Active</div>
                    <div style="background: {{ $colorScheme->outline }}" class="flex justify-center items-center">Outline</div>
                    <div style="background: {{ $colorScheme->text }}" class="flex justify-center items-center">Text</div>
                    <div style="background: {{ $colorScheme->text_gray }}" class="flex justify-center items-center">Text Gray</div>
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
