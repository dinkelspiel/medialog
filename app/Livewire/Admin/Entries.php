<?php

namespace App\Livewire\Admin;

use Livewire\Component;

class Entries extends Component
{
    public bool $show0Entries = false;
    public bool $show0Creators = false;
    public bool $show0Studios = false;

    public function toggleShow0Entries() {
        $this->show0Entries = !$this->show0Entries;
    }

    public function toggleShow0Creators() {
        $this->show0Creators = !$this->show0Creators;
    }

    public function toggleShow0Studios() {
        $this->show0Studios = !$this->show0Studios;
    }

    public function render()
    {
        return view("livewire.admin.entries")->layout("layouts.app", [
            "header" => "admin",
        ]);
    }
}
