<div class="grid grid-cols-2 m-3 gap-3">
    <input wire:model="search" type="text" placeholder="Search franchise..." class="grid-item col-span-2 input"/>

    <ul class="grid-item col-span-2">
        @foreach($franchises as $franchise)
            <li>{{ $franchise->name }}</li>
        @endforeach
    </ul>
</div>