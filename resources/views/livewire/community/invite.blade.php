<div>
    <div class="flex flex-col gap-8 justify-center items-center h-[100dvh]">
        <div class="text-xl font-semibold">
            You have been to medialog by {{ $user->username }}
        </div>
        <form wire:submit.prevent="register" class="flex flex-col gap-4 md:pr-8 py-8">
            <x-input wire:model="regUsername" placeholder="Username" />
            <x-input wire:model="regEmail" placeholder="Email" />
            <x-input wire:model="regPassword" placeholder="Password" type="password" />
            <x-button type="submit">
                Sign up
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
    @foreach (json_decode($errors) as $key => $value)
        @foreach ($value as $error)
            <div class="error">
                {{ $error }}
            </div>
        @endforeach
    @endforeach
</div>
