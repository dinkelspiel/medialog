<a href="/">
    @if ($page == 'home')
        <x-button.nav.selected label="Home">
            <x-icons.logo />
        </x-button.nav.selected>
    @else
        <x-button.nav label="Home">
            <x-icons.logo />
        </x-button.nav>
    @endif
</a>
@if (auth()->check())
    <a href="/dashboard" class="mb-auto">
        @if ($page == 'dashboard')
            <x-button.nav.selected label="Dashboard">
                <x-icons.house />
            </x-button.nav.selected>
        @else
            <x-button.nav label="Dashboard">
                <x-icons.house />
            </x-button.nav>
        @endif
    </a>
@endif

@if (auth()->check() && auth()->user()->permission && auth()->user()->permission->permission == 'admin')
    <a href="/admin">
        @if ($page == 'admin')
            <x-button.nav.selected label="Admin">
                <x-icons.admin />
            </x-button.nav.selected>
        @else
            <x-button.nav label="Admin">
                <x-icons.admin />
            </x-button.nav>
        @endif
    </a>
@endif
@if (auth()->check())
    <a href="/profile">
        @if ($page == 'profile')
            <x-button.nav.selected label="Profile">
                <x-icons.person />
            </x-button.nav.selected>
        @else
            <x-button.nav label="Profile">
                <x-icons.person />
            </x-button.nav>
        @endif
    </a>
@endif
