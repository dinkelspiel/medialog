<div class="xl:mx-96 mx-0 py-3 flex flex-col gap-4 h-[calc(100dvh)]">
    <div class="font-semibold text-xl flex flex-row mx-auto w-max items-center py-4">
        Settings
    </div>
    <div class="pt-3 font-semibold text-xl">
        Rating Style
    </div>
    <x-select class="w-full" wire:change="setRatingStyle($event.target.value)">
        <option value="range" @if ($ratingStyle == 'range') selected @endif>
            Range
        </option>
        <option value="stars" @if ($ratingStyle == 'stars') selected @endif>
            Stars
        </option>
    </x-select>

    <div class="pt-3 font-semibold text-xl">
        Show Studio or Director/Writer under entries
    </div>
    <x-select class="w-full" wire:change="setSubtextStyle($event.target.value)">
        <option value="studio" @if ($subtextStyle == 'studio') selected @endif>
            Studio
        </option>
        <option value="creator" @if ($subtextStyle == 'creator') selected @endif>
            Creator
        </option>
    </x-select>

    <div class="pt-3 flex flex-row justify-between">
        <div class="font-semibold text-xl">
            Color Scheme
        </div>
        <a class="text-btn" href="/color-schemes">
            Browse Color Schemes
        </a>
    </div>
    @if (!auth()->user()->colorScheme)
        <x-button wire:click="createCustomColorScheme">Create Custom Color Scheme</x-button>
    @else
        <div class="flex flex-col gap-3">
            <div>Name</div>
            <x-input class="w-full" wire:model.live="colorSchemeName" />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div class="flex items-center gap-2">
                <div class="me-auto">Card</div>
                <div class="h-12 w-12 rounded-full" style="background: {{ $card }}"></div>
                <x-input placeholder="#AABBCC" wire:model.live="card" />
            </div>
            <div class="flex items-center gap-2">
                <div class="me-auto">Secondary</div>
                <div class="h-12 w-12 rounded-full" style="background: {{ $secondary }}"></div>
                <x-input placeholder="#AABBCC" wire:model.live="secondary" />
            </div>

            <div class="flex items-center gap-2">
                <div class="me-auto">Card Hover</div>
                <div class="h-12 w-12 rounded-full" style="background: {{ $cardHover }}"></div>
                <x-input placeholder="#AABBCC" wire:model.live="cardHover" />
            </div>
            <div class="flex items-center gap-2">
                <div class="me-auto">Secondary Hover</div>
                <div class="h-12 w-12 rounded-full" style="background: {{ $secondaryHover }}"></div>
                <x-input placeholder="#AABBCC" wire:model.live="secondaryHover" />
            </div>

            <div class="flex items-center gap-2">
                <div class="me-auto">Card Active</div>
                <div class="h-12 w-12 rounded-full" style="background: {{ $cardActive }}"></div>
                <x-input placeholder="#AABBCC" wire:model.live="cardActive" />
            </div>
            <div class="flex items-center gap-2">
                <div class="me-auto">Secondary Active</div>
                <div class="h-12 w-12 rounded-full" style="background: {{ $secondaryActive }}"></div>
                <x-input placeholder="#AABBCC" wire:model.live="secondaryActive" />
            </div>

            <div class="flex items-center gap-2">
                <div class="me-auto">Text</div>
                <div class="h-12 w-12 rounded-full" style="background: {{ $text }}"></div>
                <x-input placeholder="#AABBCC" wire:model.live="text" />
            </div>
            <div class="flex items-center gap-2">
                <div class="me-auto">Text Gray</div>
                <div class="h-12 w-12 rounded-full" style="background: {{ $textGray }}"></div>
                <x-input placeholder="#AABBCC" wire:model.live="textGray" />
            </div>

            <div class="flex items-center gap-2">
                <div class="me-auto">Background</div>
                <div class="h-12 w-12 rounded-full border-2 c-border-outline" style="background: {{ $background }}">
                </div>
                <x-input placeholder="#AABBCC" wire:model.live="background" />
            </div>
            <div class="flex items-center gap-2">
                <div class="me-auto">Outline</div>
                <div class="h-12 w-12 rounded-full" style="background: {{ $outline }}"></div>
                <x-input placeholder="#AABBCC" wire:model.live="outline" />
            </div>
        </div>
        <x-button wire:click="saveColorScheme">
            @if (auth()->user()->colorScheme->creator_id != auth()->user()->id)
                Remix Color Scheme
            @else
                Save
            @endif
        </x-button>
        <x-button.secondary wire:click="createCustomColorScheme">Create new color scheme</x-button.secondary>
    @endif
    @foreach (json_decode($errors) as $key => $value)
        @foreach ($value as $error)
            <div>
                <div>Error</div>
                <div>
                    <div class="">{{ $error }}</div>
                </div>
            </div>
        @endforeach
    @endforeach
    <form wire:submit.prevent="logout" class="justify-end mt-auto pb-16">
        @csrf
        <x-button class="w-full mt-auto" type="submit">
            Logout
        </x-button>
    </form>
</div>
