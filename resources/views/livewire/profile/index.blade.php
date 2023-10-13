<div class="xl:mx-96 mx-0 py-3 flex flex-col gap-2 h-[calc(100dvh)]">
    <div class="pt-3">
        Rating Style
    </div>
    <select class="input w-full" wire:change="setRatingStyle($event.target.value)">
        <option value="range" @if($ratingStyle == "range") selected @endif>
            Range
        </option>
        <option value="stars" @if($ratingStyle == "stars") selected @endif>
            Stars
        </option>
    </select>

    <div class="pt-3">
        BrowserEntry Subtext Style
    </div>
    <select class="input w-full" wire:change="setSubtextStyle($event.target.value)">
        <option value="studio" @if($subtextStyle == "studio") selected @endif>
            Studio
        </option>
        <option value="creator" @if($subtextStyle == "creator") selected @endif>
            Creator
        </option>
    </select>

    <div class="pt-3">
        Color Scheme
    </div>
    <select class="input w-full" wire:change="setColorScheme($event.target.value)">
        <option value="auto" @if($colorScheme == "auto") selected @endif>
            Auto
        </option>
        <option value="dark" @if($colorScheme == "dark") selected @endif>
            Dark
        </option>
        <option value="light" @if($colorScheme == "light") selected @endif>
            Light
        </option>
    </select>

    <form wire:submit.prevent="logout" class="justify-end mt-auto">
        @csrf
        <button class="btn w-full mt-auto" type="submit">
            Logout
        </button>
    </form>
</div>
