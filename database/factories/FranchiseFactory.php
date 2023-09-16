<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Franchise>
 */
class FranchiseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'The ' . ucfirst($this->faker->unique()->word) . ' ' . ucfirst($this->faker->unique()->word),        
            'category_id' => Category::inRandomOrder()->first()->id
        ];
    }
}
