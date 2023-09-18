<div class="flex flex-col items-center h-screen justify-center gap-12">
    <div class="flex flex-col md:flex-row mx-auto w-max justify-center items-center">
        <form wire:submit.prevent="register" class="border-secondary border-b pb-6 md:border-b-0 md:pb-0 md:border-r border-dashed flex flex-col md:pr-10 gap-3 md:h-96 justify-center">
            @csrf
            <input class="input" placeholder="Username" name="username" required>
            @error('username') <div> {{ $message }} </div> @enderror
            <input class="input" placeholder="Email" type="email" name="email" required>
            @error('email') <div> {{ $message }} </div> @enderror
            <input class="input mb-3" placeholder="Password" type="password" name="password" required>
            @error('password') <div> {{ $message }} </div> @enderror
            <button class="btn" type="submit">Sign up</button>
        </form>
        <form wire:submit.prevent="login" class="flex flex-col pt-6 md:pt-0 md:ps-10 gap-3">
            @csrf
            <input wire:model="email" class="input" placeholder="Email" name="email" type="email" required>
            @error('email') <div> {{ $message }} </div> @enderror
            <input wire:model="password" class="input mb-3" placeholder="Password" name="password" type="password" required>
            @error('password') <div> {{ $message }} </div> @enderror
            <button class="btn" type="submit">Log in</button>
        </div>
        @if (session()->has('error'))
            <div class="max-w-full bg-red-400 border border-red-500 rounded-lg h-14 px-6 justify-center leading-13 text-center text-white">
                {{ session('error') }}
            </div>
        @endif
        @if (session()->has('message'))
            <div class="max-w-full bg-lime-400 border border-lime-500 rounded-lg h-14 px-6 justify-center leading-13 text-center text-white">
                {{ session('message') }}
            </div>
        @endif
    </div>
</div>