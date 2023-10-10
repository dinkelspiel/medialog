<?php

namespace App\Livewire\Dashboard\Modify;

use App\Models\Category;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\Person;
use App\Models\Studio;
use Livewire\Component;

class Add extends Component
{
    public string $franchiseName = "";
    public string $franchiseCategory = "";

    public string $addStudioName = "", $addPersonName = "";

    public array $entries = [];

    public function addEntry()
    {
        $this->entries[] = ['name' => '', 'studio' => '', 'cover_url' => '', 'producers' => []];
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
        if(Franchise::where('name', $this->franchiseName)->first() != null)
        {
            session()->flash('error', 'Franchise with name already exists');
            return;
        }

        if($this->franchiseName == "")
        {
            session()->flash('error', 'Franchise must have a name');
            return;
        }

        $franchise = Franchise::create(['name' => $this->franchiseName, 'category_id' => Category::where('name', $this->franchiseCategory)->first()->id]);

        foreach($this->entries as $entryRaw)
        {
            if($entryRaw['name'] == "")
            {
                session()->flash('error', 'Entry must have a name');
                $franchise->delete();
                return;
            }

            if($entryRaw['studio'] == "")
            {
                session()->flash('error', 'Entry must have a studio');
                $franchise->delete();
                return;
            }

            if($entryRaw['cover_url'] == "")
            {
                session()->flash('error', 'Entry must have a Cover URL');
                $franchise->delete();
                return;
            }

            if(count($entryRaw['producers']) == 0)
            {
                session()->flash('error', 'Entry must have atleast one producer');
                $franchise->delete();
                return;
            }

            $entry = new Entry;
            $entry->franchise_id = $franchise->id;
            $entry->name = $entryRaw['name'];
            $entry->studio_id = Studio::where('name', $entryRaw['studio'])->first()->id;
            $entry->cover_url = $entryRaw['cover_url'];

            $entry = $franchise->addEntry($entry);

            foreach($entryRaw['producers'] as $producerRaw)
            {
                $producer = Person::where('name', $producerRaw)->first();

                if($producer == null)
                {
                    continue;
                }

                $entry->producers()->attach(['person_id' => $producer->id]);
            }
        }

        $franchise->save();

        return redirect('/dashboard');
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

    public function mount()
    {
        $this->franchiseCategory = Category::first()->name;
    }

    public function render()
    {
        $studios = Studio::all();
        $studios->sort();

        return view('livewire.dashboard.modify.add')->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
