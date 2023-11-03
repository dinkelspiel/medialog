<div class="flex flex-col py-3 h-full items-center gap-2 justify-start">
    <a href="/" wire:navigate
        class="icon-btn-nav icon-btn @if ($page == 'home') icon-btn-pink @else icon-btn-white @endif">
        @include('includes.images.logo')
    </a>
    @if (auth()->check())
        <a href="/dashboard" wire:navigate
            class="icon-btn-nav icon-btn @if ($page == 'dashboard') icon-btn-pink @else icon-btn-white @endif mb-auto">
            @include('includes.images.house')
        </a>
    @endif

    @if (auth()->check() && auth()->user()->permission && auth()->user()->permission->permission == 'admin')
        <a href="/admin" wire:navigate
            class="icon-btn-nav icon-btn @if ($page == 'admin') icon-btn-pink @else icon-btn-white @endif">
            @include('includes.images.admin')
        </a>
    @endif
    @if (auth()->check())
        <a href="/profile" wire:navigate
            class="icon-btn-nav icon-btn @if ($page == 'profile') icon-btn-pink @else icon-btn-white @endif">
            @include('includes.images.person')
        </a>
    @endif
</div>
