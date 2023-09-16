<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Theme>
 */
class ThemeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $themes = array(
            "Friendship",
            "Love",
            "Coming of Age",
            "Isolation",
            "Identity",
            "Revenge",
            "Justice",
            "Honor",
            "War and Peace",
            "Technology and Humanity",
            "Environmentalism",
            "Magic and Reality",
            "Good vs Evil",
            "Fate and Free Will",
            "Time Travel",
            "Memory and Past",
            "Life and Death",
            "Transformation",
            "Ambition",
            "Courage",
            "Family",
            "Loss and Grief",
            "Power and Corruption",
            "Survival",
            "Sacrifice",
            "Morality",
            "Existentialism",
            "Dystopia and Utopia",
            "Dreams and Reality",
            "Class and Society",
            "Individual vs Society",
            "Culture and Tradition",
            "Alienation",
            "Mental Health",
            "Exploration",
            "Race and Diversity"
        );        

        return [
            'name' => $this->faker->randomElement($themes)
        ];
    }
}
