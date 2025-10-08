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
        $userId = $user->id;

        $query = Conversation::where(function ($q) use ($user) {
            $q->where('user_id1', $user->id)
            ->orWhere('user_id2', $user->id);
        });

        if ($user->isAdmin()) {
            $query->where(function ($q) use ($userId) {
                $q->where(function ($subQ) use ($userId) {
                    $subQ->where('user_id1', $userId)
                    ->whereHas('user2', function ($userQuery) {
                        $userQuery->where('is_blocked', false);
                    });
                })
                ->orWhere(function ($subQ) use ($userId) {
                    $subQ->where('user_id2', $userId)
                    ->whereHas('user1', function ($userQuery) {
                        $userQuery->where('is_blocked', false);
                    });
                });
            });
        }

        $conversations = $query->with([
            'user1', 
            'user2'
        ])->orderBy('updated_at', 'desc')->get();

        return $conversations;
    }

    public function hasUser($userId): bool
    {
        return $this->user_id1 == $userId || $this->user_id2 == $userId;
    }

    public function otherUser(User $user): ?User
    {
        if ($this->user1 == $user) {
            return $this->user2;
        }
        if ($this->user2 == $user) {
            return $this->user1;
        }
        return null;
    }
}

 
