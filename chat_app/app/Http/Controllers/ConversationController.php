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
       private function xssProtect($value)
    {
        if (is_string($value)) {
            
            return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        }
        return $value;
    }

    public function createConversation(Request $request){

 $request->validate([
        'user_id1' => 'required|integer|exists:users,id',
        'user_email' => 'required|email|exists:users,email',
    ]);

     
    $user1 = User::find($request->user_id1);
    $user2 = User::where('email', $request->user_email)->first();

    if (!$user1 || !$user2) {
        return response()->json(['error' => 'User not found.'], 404);
    }
     
    $conversation = Conversation::create([
         'name' => $this->xssProtect($user1->name) . ' & ' . $this->xssProtect($user2->name),
        'user_id1' => $user1->id,
        'user_id2' => $user2->id,
    ]);

    return response()->json([
     'conversation' => $conversation,
    'other_user' => $user2
    ], 201);

    }
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
            $sanitized = $conversations->map(function ($conv) {
                $conv->name = $this->xssProtect($conv->name);
                return $conv;
            });
            return response()->json($sanitized);
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

         $sanitized = $conversations->map(function ($conv) {
            $conv->name = $this->xssProtect($conv->name);
            return $conv;
        });

        return response()->json($sanitized);
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
        if (isset($validated['name'])) {
                $validated['name'] = $this->xssProtect($validated['name']); 
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

    public function destroy($id)
{
    $conversation = Conversation::find($id);

    if (!$conversation) {
        return response()->json(['error' => 'Conversation not found'], 404);
    }

    $conversation->delete();

    return response()->json(['message' => 'Conversation deleted successfully'], 200);
}

}
