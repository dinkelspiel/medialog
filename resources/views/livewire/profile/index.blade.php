<div class="px-96 py-3">
    <form wire:submit.prevent="logout">
        @csrf
        <button class="btn w-full" type="submit">
            Logout
        </button>
    </form>
</div>