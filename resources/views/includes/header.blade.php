<div class="flex flex-col py-3 h-screen items-center gap-2 justify-start">
    <a href="/" class="icon-btn-nav @if($page == 'home') icon-btn-pink @else icon-btn-white @endif">
        <img src="/assets/logo.svg">
    </a>
    <a href="/dashboard" class="icon-btn-nav @if($page == 'dashboard') icon-btn-pink @else icon-btn-white @endif mb-auto">
        <img src="/assets/house.svg">
    </a>

    <a href="/profile" class="icon-btn-nav @if($page == 'profile') icon-btn-pink @else icon-btn-white @endif">
        <img src="/assets/person.svg">
    </a>
</div>