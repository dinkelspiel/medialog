<div class="fixed top-0 left-0 w-screen h-screen px-20 flex items-center justify-center bg-modal">
    <div class="w-96 bg-card rounded-lg shadow-lg overflow-y-scroll" style="max-height: 80vh">
        <div class="border-b border-stone-300 text-lg p-3 flex flex-row items-center">
            <div class="mr-auto">
                Add Studio
            </div>
            <button wire:click="$dispatch('closeAddStudio')" class="text-secondary hover:text-secondary-hover active:text-secondary-active duration-100 cursor-pointer">
                X
            </button>
        </div>
        <div class="p-3 flex flex-col gap-3">
            <div>
                Name
            </div>
            <input class="input" placeholder="Name">
            <button class="small-btn">
                Add
            </button
        </div>
    </div>
</div>