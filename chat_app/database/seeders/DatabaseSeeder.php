<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Message;
use App\Models\Conversation;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => "John Doe",
            'email' => "john@example.com",
            'password' => bcrypt('password'),
            'is_admin' => true,
            'is_blocked' => false
        ]);

        User::factory()->create([
            'name' => "Jane Doe",
            'email' => "jane@example.com",
            'password' => bcrypt('password'),
            'is_admin' => false,
            'is_blocked' => false
        ]);

        User::factory(10)->create();

        Message::factory(100)->create();
        $messages = Message::all();

        $conversations = $messages->groupBy(function ($message) {
            return collect([$message->sender_id, $message->receiver_id])->sort()->implode('_');
        })->map(function ($groupedMessages) {
            return [
                'user_id1' => $groupedMessages->first()->sender_id,
                'user_id2' => $groupedMessages->first()->receiver_id,
                'last_message_id' => $groupedMessages->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values();

        Conversation::insertOrIgnore($conversations->toArray());
    }
}
