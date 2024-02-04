<?php

namespace Database\Factories;

use App\Models\Entry;
use App\Models\Person;
use App\Models\Studio;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EntryCreator>
 */
class EntryCreatorFactory extends Factory
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
            "person_id" => fake()->randomElement(
                Person::pluck("id")->toArray(),
            ),
        ];
    }
}
