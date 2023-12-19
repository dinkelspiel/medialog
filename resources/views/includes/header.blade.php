<div class="flex flex-col py-8 h-full items-center gap-3 justify-start">
    <a href="/">
        @if ($page == 'home')
            <x-button.nav.selected>
                <x-icons.logo />
            </x-button.nav.selected>
        @else
            <x-button.nav>
                <x-icons.logo />
            </x-button.nav>
        @endif
    </a>
    @if (auth()->check())
        <a href="/dashboard" class="mb-auto">
            @if ($page == 'dashboard')
                <x-button.nav.selected>
                    <x-icons.house />
                </x-button.nav.selected>
            @else
                <x-button.nav>
                    <x-icons.house />
                </x-button.nav>
            @endif
        </a>
    @endif

    @if (auth()->check() && auth()->user()->permission && auth()->user()->permission->permission == 'admin')
        <a href="/admin">
            @if ($page == 'admin')
                <x-button.nav.selected>
                    <x-icons.admin />
                </x-button.nav.selected>
            @else
                <x-button.nav>
                    <x-icons.admin />
                </x-button.nav>
            @endif
        </a>
    @endif
    @if (auth()->check())
        <a href="/profile">
            @if ($page == 'profile')
                <x-button.nav.selected>
                    <x-icons.person />
                </x-button.nav.selected>
            @else
                <x-button.nav>
                    <x-icons.person />
                </x-button.nav>
            @endif
        </a>
    @endif
</div>
