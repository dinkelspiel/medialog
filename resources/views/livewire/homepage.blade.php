<div class="grid grid-rows-[70%,30%] h-[100dvh] c-bg-background">
    <div class="grid grid-cols-2 w-full c-bg-secondary">
        <div class="c-bg-secondary flex text-white justify-center items-center">
            <div class="flex flex-col gap-8 px-24">
                <div class="font-bold text-5xl">
                    Medialog
                </div>
                <div class="text-2xl">
                    Your place for rating and reviewing Movies,<br /> Books, and TV Shows
                </div>
                <a class="flex flex-row gap-3" href="/login">
                    <x-button class="w-max !bg-black hover:!bg-slate-800 active:!bg-slate-600 px-12 c-shadow-card">
                        Sign Up
                    </x-button>
                    <button class="underline px-12">
                        Log In
                    </button>
                </a>
            </div>
        </div>
        <div class="grid grid-cols-5 gap-2 overflow-hidden bg-white opacity-75">
            @foreach (\App\Models\Entry::inRandomOrder()->limit(15)->get() as $entry)
                <img src="{{ $entry->cover_url }}" class="aspect-[2/3] object-fill w-full" />
            @endforeach
        </div>
    </div>
    <div class="flex flex-col justify-center h-full">
        <div class="text-xl flex items-center justify-center flex-row gap-2 flex-wrap h-max">
            The site built for <div class="font-bold"> you </div> to find, rate, and review <div class="font-bold">
                everything
            </div> you
        </div>
        <div class="text-xl flex items-center justify-center flex-row gap-2 flex-wrap h-max">
            watch and read in a <div class="font-bold"> single place. </div>
        </div>
    </div>
</div>
