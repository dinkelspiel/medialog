<?php

namespace App\Livewire\Dashboard\Modify;

use App\Models\Category;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\Person;
use App\Models\Studio;
use Illuminate\Support\Facades\Request;
use Livewire\Component;

class Edit extends ModifyBase
{
    public $franchiseId;
    public $hasReadFranchise = false;

    public function save()
    {
        $franchise = Franchise::find($this->franchiseId);

        if($this->franchiseName == "")
        {
            session()->flash('error', 'Franchise must have a name');
            return;
        }

        $franchise->name = $this->franchiseName;
        $franchise->category_id = Category::where('id', $this->franchiseCategory)->first()->id;

        foreach($this->entries as $entryRaw)
        {
            if($entryRaw['name'] == "")
            {
                session()->flash('error', 'Entry must have a name');
                return;
            }

            if($entryRaw['studios'] == [])
            {
                session()->flash('error', 'Entry must have atleast one studio');
                return;
            }

            if($entryRaw['cover_url'] == "")
            {
                session()->flash('error', 'Entry must have a cover_url');
                return;
            }

            if(count($entryRaw['creators']) == 0)
            {
                session()->flash('error', 'Entry must have atleast one director/writer');
                return;
            }

            if($entryRaw['id'] == null)
            {
                $entry = new Entry;
            } else {
                $entry = Entry::find($entryRaw['id']);
            }

            $entry->franchise_id = $franchise->id;
            $entry->name = $entryRaw['name'];
            $entry->cover_url = $entryRaw['cover_url'];

            if($entryRaw['id'] == null)
            {
                $entry = $franchise->addEntry($entry);
            }

            $entry->creators()->sync([]);
            foreach($entryRaw['creators'] as $creatorRaw)
            {
                $creator = Person::where('name', $creatorRaw)->first();

                if($creator == null)
                {
                    continue;
                }

                $entry->creators()->attach(['person_id' => $creator->id]);
            }

            $entry->studios()->sync([]);
            foreach($entryRaw['studios'] as $studioRaw)
            {
                $studio = Studio::where('name', $studioRaw)->first();

                if($studio == null)
                {
                    continue;
                }

                $entry->studios()->attach(['studio_id' => $studio->id]);
            }

            if($entryRaw['id'] != null)
            {
                $entry->save();
            }
        }

        $franchise->save();

        session()->flash('message', 'Updated successfully');
    }

    public function render()
    {
        if(!$this->hasReadFranchise)
        {
            $franchise = Franchise::find($this->franchiseId);
            $this->franchiseName = $franchise->name;
            $this->franchiseCategory = $franchise->category->id;

            foreach($franchise->entries as $entry)
            {
                $creators = [];

                foreach($entry->creators as $creator)
                {
                    $creators[] = $creator->name;
                }

                $studios = [];

                foreach($entry->studios as $studio)
                {
                    $studios[] = $studio->name;
                }

                $this->entries[] = ['id' => $entry->id, 'name' => $entry->name, 'studios' => $studios, 'cover_url' => $entry->cover_url, 'creators' => $creators, 'studioSearch' => '', 'creatorSearch' => ''];
            }
            $this->hasReadFranchise = true;
        }

        $studios = Studio::all();
        $studios->sort();

        return view('livewire.dashboard.modify', [
            'modifyMode' => "Edit"
        ])->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
