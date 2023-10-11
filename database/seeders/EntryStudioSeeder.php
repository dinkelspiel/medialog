<?php

namespace Database\Seeders;

use App\Models\Entry;
use App\Models\EntryStudio;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EntryStudioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Entry::all()->each(function ($entry) {
            EntryStudio::factory()->create(['entry_id' => $entry->id]);
        });
    }
}
