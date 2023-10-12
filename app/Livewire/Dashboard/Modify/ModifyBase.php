<?php
namespace App\Livewire\Dashboard\Modify;

use App\Models\Category;
use App\Models\Person;
use App\Models\Studio;
use Livewire\Component;

abstract class ModifyBase extends Component
{
    public string $franchiseName = "";
    public string $franchiseCategory = "";

    public array $entries = [];

    public function addEntry()
    {
        $this->entries[] = ['id' => null, 'name' => '', 'studioSearch' => '', 'studios' => [], 'cover_url' => '', 'creatorSearch' => '', 'creators' => []];
    }

    public function removeEntry(int $index)
    {
        unset($this->entries[$index]);
    }

    public function addMeta(string $metaTable, int $entryId, string $person)
    {
        if($metaTable == "studios") { $this->entries[$entryId]["studioSearch"] = ""; }
        if($metaTable == "creators") { $this->entries[$entryId]["creatorSearch"] = ""; }

        array_push($this->entries[$entryId][$metaTable], $person);
    }

    public function removeMeta(string $metaTable, int $entryId, string $person)
    {
        $key = array_search($person, $this->entries[$entryId][$metaTable]);

        if ($key !== null) {
            unset($this->entries[$entryId][$metaTable][$key]);
        }
    }

    public function savePerson(int $entryId)
    {
        if(strlen($this->entries[$entryId]["creatorSearch"]) == 0)
        {
            return;
        }

        if(Person::where('name', $this->entries[$entryId]["creatorSearch"])->first() != null)
        {
            session()->flash('error', 'Person with name already exists');
            return;
        }

        $person = new Person;
        $person->name = $this->entries[$entryId]["creatorSearch"];
        $person->save();

        array_push($this->entries[$entryId]['creators'], $this->entries[$entryId]["creatorSearch"]);
        $this->entries[$entryId]["creatorSearch"] = "";

        session()->flash('message', 'Added person successfully');
    }

    public function saveStudio(int $entryId)
    {
        if(strlen($this->entries[$entryId]["studioSearch"]) == 0)
        {
            return;
        }

        if(Studio::where('name', $this->entries[$entryId]["studioSearch"])->first() != null)
        {
            session()->flash('error', 'Studio with name already exists');
            return;
        }

        $studio = new Studio;
        $studio->name = $this->entries[$entryId]["studioSearch"];
        $studio->save();

        array_push($this->entries[$entryId]['studios'], $this->entries[$entryId]["studioSearch"]);
        $this->entries[$entryId]["studioSearch"] = "";

        session()->flash('message', 'Added studio successfully');
    }

    public function mount()
    {
        $this->franchiseCategory = Category::first()->id;
    }
}
