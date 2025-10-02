<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id1',
        'user_id2'
    ];

    protected $with = ['user1', 'user2'];

    public function user1()
    {
        return $this->belongsTo(User::class, 'user_id1');
    }

    public function user2()
    {
        return $this->belongsTo(User::class, 'user_id2');
    }

    public static function getAllForUser(User $user)
    {
        return Conversation::where(function ($q) use ($user) {
            $q->where('user_id1', $user->id)
            ->orWhere('user_id2', $user->id);
        })->get();
    }

    public function hasUser($userId): bool
    {
        return $this->user_id1 == $userId || $this->user_id2 == $userId;
    }

}

 
