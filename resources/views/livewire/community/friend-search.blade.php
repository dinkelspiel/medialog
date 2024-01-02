<div class="xl:mx-80 mx-0 min-h-[100dvh] py-4">
    <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-4 border-b-2 c-border-outline pb-8">
            <div class="font-semibold text-xl">
                Search for friends
            </div>
            <div class="flex flex-row gap-4">
                <x-icons.circle>
                    <x-icons.search />
                </x-icons.circle>
                <x-input class="w-full" placeholder="Username" wire:model.live="query" />
            </div>
        </div>
        <div class="grid grid-cols-[1fr,0.4fr] gap-8">
            <div class="flex flex-col gap-8">
                <div class="font-semibold text-xl">
                    @php
                        $count = \App\Models\User::where('username', 'LIKE', '%' . $query . '%')->count();
                    @endphp
                    {{ $count }} Results @if ($count > 10)
                        (10 Shown)
                    @endif
                </div>
                <div class="grid grid-cols-[1fr,0.4fr] gap-4">
                    @foreach (\App\Models\User::where('username', 'LIKE', '%' . $query . '%')->limit(10)->get() as $user)
                        <div class="flex flex-row items-center gap-4">
                            <x-profile-picture :label="$user->username[0]" />
                            <div class="font-semibold">
                                {{ $user->username }}
                            </div>
                        </div>
                        @php
                            $follow = \App\Models\UserFollow::where('user_id', auth()->user()->id)
                                ->where('follow_id', $user->id)
                                ->first();
                        @endphp
                        @if (is_null($follow) || !$follow->is_following)
                            <x-button wire:click="toggleFollow({{ $user->id }})">
                                Follow
                            </x-button>
                        @else
                            <x-button.secondary wire:click="toggleFollow({{ $user->id }})">
                                Unfollow
                            </x-button.secondary>
                        @endif
                    @endforeach
                </div>
            </div>
            <div class="flex flex-col gap-8">
                <div class="font-semibold text-xl">
                    Other ways to connect
                </div>
                <x-button.secondary>
                    <x-icons.envelope />
                    Invite Friends
                </x-button.secondary>
            </div>
        </div>
    </div>
</div>
