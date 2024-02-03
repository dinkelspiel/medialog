<?php

namespace App\Livewire\Dashboard\Modify;

use App\Models\Category;
use App\Models\Entry;
use App\Models\Franchise;
use App\Models\Person;
use App\Models\Studio;
use Livewire\Component;

class Add extends ModifyBase
{
    public function save()
    {
        if (Franchise::where("name", $this->franchiseName)->where("category_id", $this->franchiseCategory)->first() != null) {
            session()->flash("error", "Franchise with name and category already exists");
            return;
        }

        if ($this->franchiseName == "") {
            session()->flash("error", "Franchise must have a name");
            return;
        }

        $franchise = Franchise::create([
            "name" => $this->franchiseName,
            "category_id" => Category::where(
                "id",
                $this->franchiseCategory,
            )->first()->id,
        ]);

        foreach ($this->entries as $entryRaw) {
            if ($entryRaw["name"] == "") {
                session()->flash("error", "Entry must have a name");
                $franchise->delete();
                return;
            }

            if ($entryRaw["studios"] == []) {
                session()->flash("error", "Entry must have atleast one studio");
                $franchise->delete();
                return;
            }

            if ($entryRaw["cover_url"] == "") {
                session()->flash("error", "Entry must have a Cover URL");
                $franchise->delete();
                return;
            }

            if (count($entryRaw["creators"]) == 0) {
                session()->flash(
                    "error",
                    "Entry must have atleast one director/writer",
                );
                $franchise->delete();
                return;
            }

            $entry = new Entry();
            $entry->franchise_id = $franchise->id;
            $entry->name = $entryRaw["name"];
            $entry->cover_url = $entryRaw["cover_url"];

            $entry = $franchise->addEntry($entry);

            foreach ($entryRaw["creators"] as $creatorRaw) {
                $creator = Person::where("name", $creatorRaw)->first();

                if ($creator == null) {
                    continue;
                }

                $entry->creators()->attach(["person_id" => $creator->id]);
            }

            foreach ($entryRaw["studios"] as $studioRaw) {
                $studio = Studio::where("name", $studioRaw)->first();

                if ($studio == null) {
                    continue;
                }

                $entry->studios()->attach(["studio_id" => $studio->id]);
            }
        }

        $franchise->save();

        return redirect("/dashboard");
    }

    public function render()
    {
        $studios = Studio::all();
        $studios->sort();

        return view("livewire.dashboard.modify", [
            "modifyMode" => "Add",
        ])->layout("layouts.app", [
            "header" => "dashboard",
        ]);
    }
}
