<div class="lg:hidden h-20 flex flex-row items-center justify-between px-6 c-fill-text fixed w-[calc(100dvw-24px)] z-10 c-bg-background top-0"
    x-data="{ open: false }">
    <x-icons.logo />
    <button class="cursor-pointer" x-on:click="open = !open">
        <svg class="w-5 h-5 hover:fill-slate-600 active:fill-slate-500 duration-100" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
                d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
        </svg>
    </button>
    <div x-show="open" x-transition:enter="transition transform duration-300" x-transition:enter-start="translate-x-full"
        x-transition:enter-end="translate-x-0" x-transition:leave="transition transform duration-300"
        x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full"
        style="height: calc(100vh - 5rem);"
        class="w-[100dvw] duration-100 absolute top-20 -left-[15px] z-10 c-bg-background p-6 flex flex-col justify-start">
        @include('includes.header.items')
    </div>
</div>
<div id="sidebar" aria-label="Sidebar"
    class="hidden lg:flex flex-row lg:flex-col h-20 lg:px-0 py-0 lg:py-8 lg:h-full items-center gap-3 fixed top-0">
    <div class="flex h-full flex-col overflow-y-auto c-bg-background px-3 py-4 gap-3">
        @include('includes.header.items')
    </div>
</div>
