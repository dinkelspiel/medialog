<div class="flex flex-col items-center h-[calc(100dvh)] justify-center gap-12">
    <div class="flex flex-col md:flex-row mx-auto w-max justify-center items-center">
        <form wire:submit.prevent="register"
            class="border-secondary  border-b pb-6 md:border-b-0 md:pb-0 md:border-r border-dashed flex flex-col md:pr-10 gap-3 md:h-96 justify-center">
            @csrf
            <x-input wire:model="regUsername" placeholder="Username" name="username" required />
            @error('username')
                <div> {{ $message }} </div>
            @enderror
            <x-input wire:model="regEmail" placeholder="Email" type="email" name="email" required />
            @error('email')
                <div> {{ $message }} </div>
            @enderror
            <x-input wire:model="regPassword" mb-3" placeholder="Password" type="password" name="password" required />
            @error('password')
                <div> {{ $message }} </div>
            @enderror
            <x-button type="submit">Sign up</x-button>
        </form>
        <form wire:submit.prevent="login" class="flex flex-col pt-6 md:pt-0 md:ps-10 gap-3">
            @csrf
            <x-input wire:model="logEmail" placeholder="Email" name="email" type="email" required />
            @error('email')
                <div> {{ $message }} </div>
            @enderror
            <x-input wire:model="logPassword" class="mb-3" placeholder="Password" name="password" type="password"
                required />
            @error('password')
                <div> {{ $message }} </div>
            @enderror
            <x-button type="submit">Log in</x-button>
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
</div>
