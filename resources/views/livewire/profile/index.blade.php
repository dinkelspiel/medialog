<div class="xl:mx-96 mx-0 py-3 flex flex-col gap-2">
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
    <form wire:submit.prevent="logout">
        @csrf
        <button class="btn w-full mt-96" type="submit">
            Logout
        </button>
    </form>
</div>
