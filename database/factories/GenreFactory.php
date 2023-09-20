<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Genre>
 */
class GenreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $genres = array(
            "Action",
            "Adventure",
            "Comedy",
            "Drama",
            "Slice of Life",
            "Fantasy",
            "Magic",
            "Supernatural",
            "Horror",
            "Mystery",
            "Psychological",
            "Romance",
            "Sci-Fi",
            "Cyberpunk",
            "Post-Apocalyptic",
            "Sports",
            "Martial Arts",
            "Historical",
            "War",
            "Mecha",
            "Music",
            "Shoujo",
            "Shounen",
            "Seinen",
            "Josei",
            "Space",
            "Vampire",
            "Yaoi",
            "Yuri",
            "Harem",
            "Reverse Harem",
            "School",
            "Ecchi",
            "Super Power"
        );

        return [
            'name' => $this->faker->unique()->randomElement($genres)
        ];
    }
}
