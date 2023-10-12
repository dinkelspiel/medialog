<div class="flex flex-col py-3 items-center gap-2 justify-start">
    <a href="/" class="icon-btn-nav @if($page == 'home') icon-btn-pink @else icon-btn-white @endif">
        <img src="/assets/logo.svg">
    </a>
    @if(auth()->check())
        <a href="/dashboard" class="icon-btn-nav @if($page == 'dashboard') icon-btn-pink @else icon-btn-white @endif mb-auto">
            <img src="/assets/house.svg">
        </a>
    @endif

    @if(auth()->check() && auth()->user()->permission && auth()->user()->permission->permission == "admin")
        <a href="/admin" class="icon-btn-nav @if($page == 'admin') icon-btn-pink @else icon-btn-white @endif">
            <img src="/assets/admin.svg">
        </a>
    @endif
    @if(auth()->check())
        <a href="/profile" class="icon-btn-nav @if($page == 'profile') icon-btn-pink @else icon-btn-white @endif">
            <img src="/assets/person.svg">
        </a>
    @endif
</div>
