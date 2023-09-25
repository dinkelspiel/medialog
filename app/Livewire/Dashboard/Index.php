<?php

namespace App\Livewire\Dashboard;

use App\Enums\SortAfterEnum;
use App\Models\UserEntry;
use Carbon\Carbon;
use Livewire\Component;

class Index extends Component
{
    public $listeners = ['refreshUserEntries' => '$refresh', 'setSortAfter' => 'setSortAfter'];

    protected $rules = [
        'userEntry.rating' => 'required',
        'userEntry.notes' => '',
    ];

    public $userEntry = null;

    public string $sortAfter = "";

    public function setSortAfter(string $sort)
    {
        $this->sortAfter = $sort;
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

        $userEntry->watched_at = Carbon::now();
        $userEntry->save();

        $this->userEntry = $userEntry;
    }

    public function saveUserEntry()
    {
        $user = auth()->user();

        if($this->userEntry->user_id != $user->id)
        {
            return "You cannot edit a user entry that is not yours.";
        }

        $this->userEntry->save();

        session()->flash("userEntryMessage", "Update successful");
    }

    public function deleteUserEntry()
    {
        $this->userEntry->delete();
        $this->userEntry = null;
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
            case SortAfterEnum::Watched->value:
                $userEntries = $userEntries->orderBy('watched_at', 'desc')->orderBy('id', 'desc')->get();
                break;
            case SortAfterEnum::Updated->value:
                $userEntries = $userEntries->orderBy('updated_at', 'desc')->orderBy('id', 'desc')->get();
                break;
            case SortAfterEnum::Rating->value:
                $userEntries = $userEntries->orderBy('rating', 'desc')->orderBy('id', 'desc')->get();
                break;
            case SortAfterEnum::AZ->value:
                $userEntries = UserEntry::with(['entry.franchise'])
                    ->join('entries', 'user_entries.entry_id', '=', 'entries.id') // join the entries table
                    ->join('franchises', 'entries.franchise_id', '=', 'franchises.id') // join the franchises table
                    ->orderBy('franchises.name') // order by franchise name
                    ->select('user_entries.*') // select only user_entries fields to avoid field name conflicts
                    ->get();
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
