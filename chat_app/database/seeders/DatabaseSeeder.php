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

        $users = User::all();
        $conversations = collect();

        while ($conversations->count() < 20) {
            $user1 = $users->random();
            $user2 = $users->where('id', '!=', $user1->id)->random();

            $exists = $conversations->first(function($c) use ($user1, $user2){
                return ($c->user_id1 == $user1->id && $c->user_id2 == $user2->id)
                    || ($c->user_id1 == $user2->id && $c->user_id2 == $user1->id);
            });

            if (!$exists) {
                $conversations->push(Conversation::create([
                    'user_id1' => min($user1->id, $user2->id),
                    'user_id2' => max($user1->id, $user2->id),
                    'name' => $user1->name . ' & ' . $user2->name,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]));
            }
        }

        Conversation::insertOrIgnore($conversations->toArray());

        $messages = collect();
        for ($i = 0; $i < 100; $i++) {
            $conversation = $conversations->random();

            $sender = collect([$conversation->user_id1, $conversation->user_id2])->random();
            $receiver = $sender == $conversation->user_id1 ? $conversation->user_id2 : $conversation->user_id1;

            $message = Message::factory()->create([
                'conversation_id' => $conversation->id,
                'sender_id' => $sender,
                'receiver_id' => $receiver,
            ]);

            $messages->push($message);
        }
    }
}
