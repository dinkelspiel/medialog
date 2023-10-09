<div class="px-96 py-3 flex flex-col gap-2">
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
    <form wire:submit.prevent="logout" class="mt-10">
        @csrf
        <button class="btn w-full" type="submit">
            Logout
        </button>
    </form>
</div>