<div>
    <div class="flex flex-col-reverse md:flex-row justify-center items-center h-[100dvh]">
        <form wire:submit.prevent="register"
            class="flex flex-col border-t-2 md:border-r-2 md:border-t-0 gap-4 c-border-r-outline md:pr-8 py-8">
            <x-input wire:model="regUsername" placeholder="Username" />
            <x-input wire:model="regEmail" placeholder="Email" />
            <x-input wire:model="regPassword" placeholder="Password" type="password" />
            <x-button type="submit">
                Sign up
            </x-button>
        </form>
        <form wire:submit.prevent="login" class="flex flex-col gap-4 py-8 md:ps-8">
            <x-input wire:model="logEmail" placeholder="Email" />
            <x-input wire:model="logPassword" placeholder="Password" type="password" />
            <x-button type="submit">
                Log in
            </x-button>
        </form>
    </div>
    @if (session()->has('error'))
        <div class="error">
            {{ session('error') }}
        </div>
    @endif
    @if (session()->has('message'))
        <div class="success">
            {{ session('message') }}
        </div>
    @endif
</div>
