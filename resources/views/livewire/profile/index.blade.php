<div class="xl:mx-80 mx-0 min-h-[100dvh] py-4">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr,0.4fr] gap-8">
        <div class="lg:scrollable-grid-item no-scrollbar lg:!h-[calc(100dvh-32px)] flex flex-col gap-8">
            <div class="flex flex-col lg:flex-row w-full items-center h-max lg:h-[56px] gap-4">
                <div class="flex flex-row items-center gap-4">
                    <x-profile-picture.large :label="$user->username[0]" />
                    <div class="font-semibold text-xl">
                        {{ $user->username }}'s Profile
                    </div>
                </div>
                @if (auth()->check() && auth()->user()->id != $user->id)
                    @php
                        $follow = \App\Models\UserFollow::where('user_id', auth()->user()->id)
                            ->where('follow_id', $this->user->id)
                            ->first();
                    @endphp
                    @if (is_null($follow) || !$follow->is_following)
                        <x-button class="ms-auto w-max px-16" wire:click="toggleFollow">
                            Follow
                        </x-button>
                    @else
                        <x-button.secondary class="ms-auto w-max px-16" wire:click="toggleFollow">
                            Unfollow
                        </x-button.secondary>
                    @endif
                @elseif(auth()->check() && auth()->user()->id == $user->id)
                    <div class="flex flex-col w-full lg:w-max lg:flex-row gap-4 ms-auto">
                        <a href="/settings">
                            <x-button.secondary class="w-full ms-auto lg:w-max px-12 whitespace-nowrap">
                                <x-icons.gear />
                                Settings
                            </x-button.secondary>
                        </a>
                        <x-button.secondary class="w-full ms-auto lg:w-max px-12 whitespace-nowrap" wire:click="logout">
                            <x-icons.door-open />
                            Log out
                        </x-button.secondary>
                    </div>
                @endif
            </div>
            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-4">
                    <div class="font-semibold text-xl w-full">
                        Stats
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div class="rounded-[32px] border-2 c-border-card flex flex-row gap-4 items-center py-4 px-8">
                            <x-icons.fire class="c-fill-secondary" />
                            <div class="flex flex-col">
                                <div class="text-xl font-semibold">
                                    {{ $user->getDailyStreak() }}
                                </div>
                                <div class="c-text-textgray">
                                    Day Streak
                                </div>
                            </div>
                        </div>
                        <div class="rounded-[32px] border-2 c-border-card flex flex-row gap-4 items-center py-4 px-8">
                            <x-icons.eye class="c-fill-secondary" />
                            <div class="flex flex-col">
                                <div class="text-xl font-semibold">
                                    {{ \App\Models\UserEntry::where('user_id', $user->id)->where('status', 'completed')->count() }}
                                </div>
                                <div class="c-text-textgray">
                                    Completed Entries
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="font-semibold text-xl w-full">
                        Activity
                    </div>
                    @foreach (\App\Models\Activity::where('user_id', $user->id)->limit(10)->orderBy('id', 'DESC')->get() as $activity)
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-row gap-2 items-center">
                                <x-profile-picture :label="$user->username[0]" />
                                <div class="font-semibold">
                                    {{ $user->username }}
                                </div>

                                @switch($activity->type)
                                    @case(\App\Enums\ActivityTypeEnum::StatusUpdate)
                                        @php
                                            $rewatch = explode('|', $activity->additional_data)[1];
                                        @endphp
                                        @switch(explode('|', $activity->additional_data)[0])
                                            @case('planning')
                                                @if ($rewatch == 0)
                                                    plans to watch
                                                @else
                                                    , for the {{ \App\Helpers\numberSuffix($rewatch + 1) }} time, plans to watch
                                                @endif
                                            @break

                                            @case('watching')
                                                @if ($rewatch == 0)
                                                    is watching
                                                @else
                                                    is for the {{ \App\Helpers\numberSuffix($rewatch + 1) }} time watching
                                                @endif
                                            @break

                                            @case('dnf')
                                                @if ($rewatch == 0)
                                                    did not finish
                                                @else
                                                    did not finish their {{ \App\Helpers\numberSuffix($rewatch + 1) }} rewatch of
                                                @endif
                                            @break

                                            @case('paused')
                                                @if ($rewatch == 0)
                                                    paused
                                                @else
                                                    paused their {{ \App\Helpers\numberSuffix($rewatch + 1) }} rewatch of
                                                @endif
                                            @break

                                            @case('completed')
                                                @if ($rewatch == 0)
                                                    completed
                                                @else
                                                    completed their {{ \App\Helpers\numberSuffix($rewatch + 1) }} rewatch of
                                                @endif
                                            @break

                                            @default
                                        @endswitch
                                    @break

                                    @case(\App\Enums\ActivityTypeEnum::Reviewed)
                                        @if ($activity->additional_data == 0)
                                            reviewed
                                        @else
                                            reviewed their {{ \App\Helpers\numberSuffix($activity->additional_data) }} rewatch
                                            of
                                        @endif
                                    @break

                                    @case(\App\Enums\ActivityTypeEnum::Rewatch)
                                        started their {{ \App\Helpers\numberSuffix($activity->additional_data) }} rewatch of
                                    @break

                                    @default
                                @endswitch

                                <div class="ms-auto">
                                    {{ Carbon\Carbon::parse($activity->created_at)->diffForHumans() }}
                                </div>
                            </div>
                            @if ($activity->type != \App\Enums\ActivityTypeEnum::Reviewed)
                                <x-entry :entry="$activity->entry" />
                            @else
                                <x-entry :entry="$activity->entry" :rating="\App\Models\UserEntry::where('user_id', $activity->user_id)
                                    ->where('entry_id', $activity->entry_id)
                                    ->first()
                                    ->getLatestRating()" />
                            @endif
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
        <div class="grid @if (auth()->check() && auth()->user()->id == $user->id) grid-rows-[1fr,0.3fr] @else grid-rows-1 @endif gap-8">
            <div class="rounded-[32px] border-2 c-border-card c-shadow-card cursor-pointer" x-data="{ page: 'following' }">
                <div class="flex flex-row h-[70px] items-center text-center font-semibold">
                    <div class="h-full flex items-center w-full border-b-2"
                        x-bind:class="{
                            'c-border-secondary c-text-secondary': page == 'following',
                            'c-border-background': page !=
                                'following'
                        }"
                        x-on:click="page = 'following'">
                        <div class="w-full">
                            Following
                        </div>
                    </div>
                    <div class="h-full flex items-center w-full cursor-pointer border-b-2"
                        x-bind:class="{
                            'c-border-secondary c-text-secondary': page == 'followers',
                            'c-border-background': page !=
                                'followers'
                        }"
                        x-on:click="page = 'followers'">
                        <div class="w-full">
                            Followers
                        </div>
                    </div>
                </div>
                <div class="p-8">
                    <div x-show="page == 'following'" class="flex flex-col gap-4">
                        @foreach (\App\Models\UserFollow::where('user_id', $user->id)->where('is_following', true)->get() as $follow)
                            <a class="flex flex-row gap-4 items-center" href="/user/{{ $follow->follow->id }}">
                                <x-profile-picture :label="$follow->follow->username[0]" />
                                {{ $follow->follow->username }}
                                @if (\App\Models\UserFollow::isMututal($user->id, $follow->follow->id))
                                    <x-icons.heart class="c-fill-secondary" />
                                @endif
                            </a>
                        @endforeach
                    </div>
                    <div x-show="page == 'followers'" class="flex flex-col gap-4">
                        @foreach (\App\Models\UserFollow::where('follow_id', $user->id)->where('is_following', true)->get() as $follow)
                            <a class="flex flex-row gap-4 items-center" href="/user/{{ $follow->user->id }}">
                                <x-profile-picture :label="$follow->user->username[0]" />
                                {{ $follow->user->username }}
                                @if (\App\Models\UserFollow::isMututal($user->id, $follow->user->id))
                                    <x-icons.heart class="c-fill-secondary" />
                                @endif
                            </a>
                        @endforeach
                    </div>
                </div>
            </div>
            @if (auth()->check() && auth()->user()->id == $user->id)
                <div class="rounded-[32px] border-2 c-border-card c-shadow-card c-text-text">
                    <div class="flex flex-row h-[70px] items-center text-center font-semibold">
                        <div class="h-full flex items-center w-full">
                            <div class="w-full">
                                Add Friends
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 pb-8 px-8">
                        <a href="/friend-search">
                            <x-button.secondary>
                                <x-icons.search />
                                Find Friends
                            </x-button.secondary>
                        </a>
                        <x-button.invite />
                    </div>
                </div>
            @endif
        </div>
    </div>
</div>
