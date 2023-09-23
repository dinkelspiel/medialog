<?php

namespace App\Livewire\Dashboard;

use App\Enums\SortAfterEnum;
use App\Models\UserEntry;
use Livewire\Component;

class Index extends Component
{
    public $listeners = ['refreshUserEntries' => '$refresh', 'setSortAfter' => 'setSortAfter'];

    public ?UserEntry $userEntry = null;

    public string $sortAfter = "";

    public function setSortAfter(string $sort)
    {
        $this->sortAfter = $sort;
        dd($sort);
    }

    public function showUserEntry($id)
    {
        $this->userEntry = UserEntry::where('id', $id)->where('user_id', auth()->user()->id)->first();
    }

    public function closeUserEntry()
    {
        $this->userEntry = null;
    }

    public function markAsComplete(int $entryId)
    {
        $user = auth()->user();

        $userEntry = UserEntry::where('id', $entryId)->where('user_id', $user->id)->first();

        if(is_null($userEntry))
        {
            return "No valid user entry found";
        }

        $userEntry->rating = 0;
        $userEntry->save();

        $this->userEntry = $userEntry;
    }

    public function render()
    {
        if($this->sortAfter === "")
        {
            $this->sortAfter = array_column(SortAfterEnum::cases(), 'value')[0];
        }

        $userEntries = UserEntry::where('user_id', auth()->user()->id);
        switch($this->sortAfter)
        {
            case SortAfterEnum::Created->value: 
                $userEntries = $userEntries->orderBy('created_at', 'desc')->get();
                break;
            case SortAfterEnum::Updated->value:
                $userEntries = $userEntries->orderBy('updated_at', 'desc')->get();
                break;
            case SortAfterEnum::Rating->value:
                $userEntries = $userEntries->orderBy('rating', 'desc')->get();
                break;
            case SortAfterEnum::AZ->value:
                $userEntries = UserEntry::with(['franchise' => function ($query) {
                    $query->orderBy('name')->orderBy('id');
                }])->orderBy('franchise_id')->get();                
                break;
        }

        return view('livewire.dashboard.index', [
            'userEntry' => $this->userEntry,
            'userEntries' => $userEntries,
            'sortAfter' => $this->sortAfter
        ])->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
