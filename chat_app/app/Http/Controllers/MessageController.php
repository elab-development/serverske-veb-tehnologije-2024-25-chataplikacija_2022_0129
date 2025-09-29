<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
   
    public function index()
    {
         
        $messages = Message::with(['sender', 'receiver'])->get();
        return response()->json($messages);
    }

 
    public function create()
    {
        return response()->json([
            'message' => 'Provide sender_id, receiver_id, conversation_id (optional), content'
        ]);
    }

 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sender_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'conversation_id' => 'nullable|exists:conversations,id',
            'content' => 'nullable|string',
        ]);

        $message = Message::create($validated);

        return response()->json($message, 201);
    }

 
    public function show(Message $message)
    {
        return response()->json($message->load(['sender', 'receiver', 'conversation']));
    }

 
    public function edit(Message $message)
    {
        return response()->json($message);
    }
 
    public function update(Request $request, Message $message)
    {
        $validated = $request->validate([
            'content' => 'nullable|string',
            'sender_id' => 'nullable|exists:users,id',
            'receiver_id' => 'nullable|exists:users,id',
            'conversation_id' => 'nullable|exists:conversations,id',
        ]);

        $message->update($validated);

        return response()->json($message);
    }
 
    public function destroy(Message $message)
    {
        $message->delete();
        return response()->json(['message' => 'Deleted successfully'], 204);
    }
}
