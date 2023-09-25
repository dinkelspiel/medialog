<?php

namespace App\Livewire\Dashboard\Add;

use App\Models\Category;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\Genre;
use App\Models\Person;
use App\Models\Studio;
use App\Models\Theme;
use Livewire\Component;

class AddFranchise extends Component
{
    public string $franchiseName = "";
    public string $franchiseCategory = "";

    public array $entries = [];

    public function addEntry()
    {
        $this->entries[] = ['name' => '', 'studio' => '', 'cover_url' => '', 'producers' => [], 'cast' => [], 'genres' => [], 'themes' => []];
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
        $franchise = Franchise::create(['name' => $this->franchiseName, 'category_id' => Category::where('name', $this->franchiseCategory)->first()->id]);

        foreach($this->entries as $entryRaw)
        {
            $entry = new Entry;
            $entry->franchise_id = $franchise->id;
            $entry->name = $entryRaw['name'];
            $entry->studio_id = Studio::where('name', $entryRaw['studio'])->first()->id;
            $entry->cover_url = $entryRaw['cover_url'];

            $entry = $franchise->addEntry($entry);

            foreach($entryRaw['themes'] as $themeRaw)
            {
                $theme = Theme::where('name', $themeRaw)->first();

                if($theme == null)
                {
                    continue;
                }

                $entry->themes()->attach(['theme_id' => $theme->id]);
            }

            foreach($entryRaw['genres'] as $genreRaw)
            {
                $genre = Genre::where('name', $genreRaw)->first();

                if($genre == null)
                {
                    continue;
                }

                $entry->genres()->attach(['genre_id' => $genre->id]);
            }

            foreach($entryRaw['producers'] as $producerRaw)
            {
                $producer = Person::where('name', $producerRaw)->first();

                if($producer == null)
                {
                    continue;
                }

                $entry->producers()->attach(['person_id' => $producer->id]);
            }

            foreach($entryRaw['cast'] as $castRaw)
            {
                $cast = Person::where('name', $castRaw)->first();

                if($cast == null)
                {
                    continue;
                }

                $entry->cast()->attach(['person_id' => $cast->id]);
            }
        }

        $franchise->save();

        return redirect('/dashboard');
    }

    public function mount()
    {
        $this->franchiseCategory = Category::first()->name;
    }

    public function render()
    {
        $studios = Studio::all();
        $studios->sort();

        return view('livewire.dashboard.add.add-franchise')->layout('layouts.app', [
            'header' => 'dashboard'
        ]);
    }
}
