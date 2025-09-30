<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Conversation;
use Exception;

class ConversationController extends Controller
{
    public function listByUser(Request $request){
   try {

    $request->validate([
            'user_id' => 'required|integer|exists:users,id'
        ]);

    $userId = $request->user_id;

    $conversations = Conversation::where(function ($q) use ($userId) {
        $q->where('user_id1', $userId)
          ->orWhere('user_id2', $userId);
    })->get();

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
public function update(Request $request, $id)
{
    $conversation = Conversation::findOrFail($id);

    $validated = $request->validate([
        'name'     => 'nullable|string|max:255',
        'user_id1' => 'sometimes|exists:users,id',
        'user_id2' => 'sometimes|exists:users,id',
    ]);

    $conversation->update($validated);

    return response()->json($conversation, 200);
}

public static function listByUserInternal(int $userId){
  
    
 
    return Conversation::where(function ($q) use ($userId) {
        $q->where('user_id1', $userId)
          ->orWhere('user_id2', $userId);
    })->get();

       
       
}
}
