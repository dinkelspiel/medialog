<?php

namespace Database\Factories;

use App\Models\Entry;
use App\Models\Studio;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EntryStudio>
 */
class EntryStudioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "entry_id" => fake()->randomElement(Entry::pluck("id")->toArray()),
            "studio_id" => fake()->randomElement(
                Studio::pluck("id")->toArray(),
            ),
        ];
    }
}
