<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Conversation;
use App\Http\Resources\ConversationResource;
use Exception;
use Carbon\Carbon;

class ConversationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $user1 = $request->user();
        $user2 = User::findOrFail($validated['user_id']);

        $conversation = Conversation::create([
            'user_id1' => min($user1->id, $user2->id),
            'user_id2' => max($user1->id, $user2->id),
            'name' => null,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        return response()->json($conversation, 201);
    }

    public function listByUser(Request $request){
        try {
            $request->validate([
                    'user_id' => 'required|integer|exists:users,id'
                ]);

            $userId = $request->user_id;
            $conversations = Conversation::getAllForUser(User::find($userId));
            
            return response()->json($conversations);
        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage()
            ], 500);
        }
    }
        

public function searchByName(Request $request){
        $name = $request->query('name');

        if (!$name) {
            return response()->json(['error' => 'Name query parameter is required'], 400);
        }

        $conversations = Conversation::where('name', 'like', "%{$name}%")->get();

        return response()->json($conversations);
    }
public function update(Request $request, $conversationId)
{
    try{
        $validated = $request->validate([
            'name' => 'nullable|string|max:255'
        ]);

        $conversation = Conversation::findOrFail($conversationId);
        
        $user = $request->user();

        if ($conversation->user_id1 !== $user->id && $conversation->user_id2 !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $conversation->update($validated);

        return response()->json($conversation, 200);
    } catch (Exception $e) {
        return response()->json([
            'error' => true,
            'message' => $e->getMessage()
        ], 500);
    }
}

    public static function listByUserInternal(int $userId){
        return Conversation::where(function ($q) use ($userId) {
            $q->where('user_id1', $userId)
            ->orWhere('user_id2', $userId);
        })->get();
    }

    public static function getMaxId(){
        return Conversation::max('id');
    }
}
