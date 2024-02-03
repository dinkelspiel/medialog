<?php

namespace Database\Factories;

use App\Models\Franchise;
use App\Models\Studio;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Entry>
 */
class EntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "franchise_id" => Franchise::inRandomOrder()->first()->id,
            "name" => "Season " . fake()->word(),
            "cover_url" => fake()->imageUrl(),
        ];
    }
}
