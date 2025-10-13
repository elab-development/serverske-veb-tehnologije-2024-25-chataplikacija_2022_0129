<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'sender_id',
        'receiver_id',
        'conversation_id'
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public static function getMessagesForConversation(Conversation $conversation){
        return Message::where('conversation_id', $conversation->id)
        ->with(['sender', 'receiver', 'attachments'])
        ->orderBy('created_at', 'asc')
        ->take(50)
        ->get();
    }
}
