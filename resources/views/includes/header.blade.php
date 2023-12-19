<div class="flex flex-col py-8 h-full items-center gap-3 justify-start">
    <a href="/">
        <x-button.nav>
            <x-icons.logo />
        </x-button.nav>
    </a>
    @if (auth()->check())
        <a href="/dashboard" class="mb-auto">
            <x-button.nav.selected>
                <x-icons.house />
            </x-button.nav.selected>
        </a>
    @endif

    @if (auth()->check() && auth()->user()->permission && auth()->user()->permission->permission == 'admin')
        <a href="/admin">
            <x-button.nav>
                <x-icons.admin />
            </x-button.nav>
        </a>
    @endif
    @if (auth()->check())
        <a href="/profile">
            <x-button.nav>
                <x-icons.person />
            </x-button.nav>
        </a>
    @endif
</div>
