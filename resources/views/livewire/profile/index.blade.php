<div class="xl:mx-96 mx-0 py-3 flex flex-col gap-2 h-[calc(100dvh)]">
    <div class="pt-3">
        Rating Style
    </div>
    <select class="input input-primary w-full" wire:change="setRatingStyle($event.target.value)">
        <option value="range" @if ($ratingStyle == 'range') selected @endif>
            Range
        </option>
        <option value="stars" @if ($ratingStyle == 'stars') selected @endif>
            Stars
        </option>
    </select>

    <div class="pt-3">
        BrowserEntry Subtext Style
    </div>
    <select class="input input-primary w-full" wire:change="setSubtextStyle($event.target.value)">
        <option value="studio" @if ($subtextStyle == 'studio') selected @endif>
            Studio
        </option>
        <option value="creator" @if ($subtextStyle == 'creator') selected @endif>
            Creator
        </option>
    </select>

    <div class="pt-3 flex flex-row justify-between">
        <div>
            Color Scheme
        </div>
        <a class="text-btn" href="/color-schemes">
            Browse Color Schemes
        </a>
    </div>
    @if(!auth()->user()->colorScheme)
        <button class="btn btn-primary" wire:click="createCustomColorScheme">Create Custom Color Scheme</button>
    @else
        <div class="flex flex-col gap-3">
            <div>Name</div>
            <input class="small-input input-primary w-full" wire:model.live="colorSchemeName" />
        </div>
        <div class="grid grid-cols-2 gap-3">
            <div class="flex items-center gap-2">
                <div class="me-auto">Card</div>
                <div class="h-12 w-12 rounded-lg" style="background: {{ $card }}"></div>
                <input class="small-input input-primary" placeholder="#AABBCC" wire:model.live="card" />
            </div>
            <div class="flex items-center gap-2">
                <div class="me-auto">Secondary</div>
                <div class="h-12 w-12 rounded-lg" style="background: {{ $secondary }}"></div>
                <input class="small-input input-primary" placeholder="#AABBCC" wire:model.live="secondary" />
            </div>

            <div class="flex items-center gap-2">
                <div class="me-auto">Card Hover</div>
                <div class="h-12 w-12 rounded-lg" style="background: {{ $cardHover }}"></div>
                <input class="small-input input-primary" placeholder="#AABBCC" wire:model.live="cardHover" />
            </div>
            <div class="flex items-center gap-2">
                <div class="me-auto">Secondary Hover</div>
                <div class="h-12 w-12 rounded-lg" style="background: {{ $secondaryHover }}"></div>
                <input class="small-input input-primary" placeholder="#AABBCC" wire:model.live="secondaryHover" />
            </div>

            <div class="flex items-center gap-2">
                <div class="me-auto">Card Active</div>
                <div class="h-12 w-12 rounded-lg" style="background: {{ $cardActive }}"></div>
                <input class="small-input input-primary" placeholder="#AABBCC" wire:model.live="cardActive" />
            </div>
            <div class="flex items-center gap-2">
                <div class="me-auto">Secondary Active</div>
                <div class="h-12 w-12 rounded-lg" style="background: {{ $secondaryActive }}"></div>
                <input class="small-input input-primary" placeholder="#AABBCC" wire:model.live="secondaryActive" />
            </div>

            <div class="flex items-center gap-2">
                <div class="me-auto">Text</div>
                <div class="h-12 w-12 rounded-lg" style="background: {{ $text }}"></div>
                <input class="small-input input-primary" placeholder="#AABBCC" wire:model.live="text" />
            </div>
            <div class="flex items-center gap-2">
                <div class="me-auto">Text Gray</div>
                <div class="h-12 w-12 rounded-lg" style="background: {{ $textGray }}"></div>
                <input class="small-input input-primary" placeholder="#AABBCC" wire:model.live="textGray" />
            </div>

            <div class="flex items-center gap-2">
                <div class="me-auto">Background</div>
                <div class="h-12 w-12 rounded-lg style="background: {{ $background }}"></div>
                <input class="small-input input-primary" placeholder="#AABBCC" wire:model.live="background" />
            </div>
            <div class="flex items-center gap-2">
                <div class="me-auto">Outline</div>
                <div class="h-12 w-12 rounded-lg" style="background: {{ $outline }}"></div>
                <input class="small-input input-primary" placeholder="#AABBCC" wire:model.live="outline" />
            </div>
        </div>
        <button class="btn btn-primary" wire:click="saveColorScheme">
            @if(auth()->user()->colorScheme->creator_id != auth()->user()->id)
                Remix Color Scheme
            @else
                Save
            @endif
        </button>
    @endif
    @foreach(json_decode($errors) as $key => $value)
        @foreach($value as $error)
            <div>
                <div>Error</div>
                <div>
                    <div class="">{{ $error }}</div>
                </div>
            </div>
        @endforeach
    @endforeach
    <form wire:submit.prevent="logout" class="justify-end mt-auto">
        @csrf
        <button class="btn btn-primary w-full mt-auto" type="submit">
            Logout
        </button>
    </form>
</div>
