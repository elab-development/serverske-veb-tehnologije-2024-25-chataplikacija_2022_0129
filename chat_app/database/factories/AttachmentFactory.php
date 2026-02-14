<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attachment>
 */
class AttachmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'message_id' => null,
            'name' => $this->faker->word() . '.' . $this->faker->fileExtension(),
            'path' => $this->faker->url(),
            'mime' => $this->faker->mimeType(),
            'size' => $this->faker->randomNumber(),
            'created_at' => null,
            'updated_at' => null
        ];
    }
}
