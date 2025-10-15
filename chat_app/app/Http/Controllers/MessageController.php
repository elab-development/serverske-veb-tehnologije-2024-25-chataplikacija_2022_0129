<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\Conversation;
use App\Events\MessageSent;
use App\Http\Requests\StoreMessageRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class MessageController extends Controller
{
    //api methods
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

        broadcast(new MessageSent($message))->toOthers();

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

    public function getMessagesByConversation(Request $request){
        try{
            $request->validate([
                'conversation_id' => 'required|exists:conversations,id'
            ]);

            $conversationId = $request->conversation_id;
            $messages = Message::getMessagesForConversation(Conversation::find($conversationId));

            return response()->json($messages);
        } catch(Exception $e) {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function sendMessage(Request $request){
        
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'nullable|string',
        ]);

        $sender_id = Auth::id();
        $receiver_id = $request->receiver_id;

        $conversation = Conversation::where(function ($q) use ($sender_id, $receiver_id) {
            $q->where('user_id1', $sender_id)->where('user_id2', $receiver_id)
            ->orWhere('user_id2', $sender_id)->where('user_id1', $receiver_id);
        })->first();

        $sender = User::findOrFail($sender_id);
        $receiver = User::findOrFail($receiver_id);

        if(!$conversation){
            $conversation = Conversation::create([
                'user_id1' => min($sender_id, $receiver_id),
                'user_id2' => max($sender_id, $receiver_id),
                'name' => $sender->name . ' & ' . $receiver->name,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

        $newMessage = Message::create([
            'sender_id' => $sender_id,
            'receiver_id' => $receiver_id,
            'conversation_id' => $conversation->id,
            'content' => $request->content,
        ]);

        Conversation::where('id', $conversation->id)->update(['updated_at' => Carbon::now()]);

        $message = Message::with(['sender', 'receiver'])->find($newMessage->id);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message, 201);
    }



    //socket methods
    public function byUser(User $user){
        $messages = Message::where('sender_id', Auth::id())
        ->where('receiver_id', $user->id)
        ->orWhere('sender_id', $user->id)
        ->where('receiver_id', Auth::id())
        ->latest()
        ->paginate(10)
        ->get();
        return $messages;
    }

    public function byConversation(Conversation $conversation){
        
    }

    public function loadOlder(Message $message){
        
    }

    //public function store(StoreMessageRequest $request){  
    //}
}
