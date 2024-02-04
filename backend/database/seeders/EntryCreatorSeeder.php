<?php

namespace Database\Seeders;

use App\Models\Entry;
use App\Models\EntryCreator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EntryCreatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Entry::all()->each(function ($entry) {
            EntryCreator::factory()->create(["entry_id" => $entry->id]);
        });
    }
}
