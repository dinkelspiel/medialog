<?php

namespace App\Livewire\Dashboard\Modify;

use App\Models\Category;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\Person;
use App\Models\Studio;
use Illuminate\Support\Facades\Request;
use Livewire\Component;

class Edit extends Component
{
    public $franchiseId;
    public $hasReadFranchise = false;

    public string $franchiseName = "";
    public string $franchiseCategory = "";

    public string $addStudioName = "", $addPersonName = "";

    public array $entries = [];

    public function addEntry()
    {
        $this->entries[] = ['id' => null, 'name' => '', 'studio' => '', 'cover_url' => '', 'creators' => []];
    }

    public function removeEntry(int $index)
    {
        unset($this->entries[$index]);
    }

    public function addCast(int $entryId, string $person)
    {
        $this->entries[$entryId]['cast'][$person] = "";
    }

    public function removeCast(int $entryId, $person)
    {
        unset($this->entries[$entryId]['cast'][$person]);
    }

    public function addMeta(string $metaTable, int $entryId, string $person)
    {
        array_push($this->entries[$entryId][$metaTable], $person);
    }

    public function removeMeta(string $metaTable, int $entryId, string $person)
    {
        $key = array_search($person, $this->entries[$entryId][$metaTable]);

        if ($key !== null) {
            unset($this->entries[$entryId][$metaTable][$key]);
        }
    }

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

            if($entryRaw['studio'] == "")
            {
                session()->flash('error', 'Entry must have a studio');
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
            $entry->studio_id = Studio::where('name', $entryRaw['studio'])->first()->id;
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

            if($entryRaw['id'] != null)
            {
                $entry->save();
            }
        }

        $franchise->save();

        session()->flash('message', 'Updated successfully');
    }

    public function savePerson()
    {
        if(strlen($this->addPersonName) == 0)
        {
            return;
        }

        if(Person::where('name', $this->addPersonName)->first() != null)
        {
            session()->flash('error', 'Person with name already exists');
            return;
        }

        $person = new Person;
        $person->name = $this->addPersonName;
        $person->save();

        $this->addPersonName = "";
        session()->flash('message', 'Added person successfully');
    }

    public function saveStudio()
    {
        if(strlen($this->addStudioName) == 0)
        {
            return;
        }

        if(Studio::where('name', $this->addStudioName)->first() != null)
        {
            session()->flash('error', 'Studio with name already exists');
            return;
        }

        $studio = new Studio;
        $studio->name = $this->addStudioName;
        $studio->save();

        $this->addStudioName = "";
        session()->flash('message', 'Added studio successfully');
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

                $this->entries[] = ['id' => $entry->id, 'name' => $entry->name, 'studio' => $entry->studio->name, 'cover_url' => $entry->cover_url, 'creators' => $creators];
            }
            $this->hasReadFranchise = true;
        }

        $studios = Studio::all();
        $studios->sort();

        return view('livewire.dashboard.modify.edit')->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
