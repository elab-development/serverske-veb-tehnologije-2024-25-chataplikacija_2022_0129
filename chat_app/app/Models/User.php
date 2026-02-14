<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'is_blocked',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->is_admin;
    }

    public static function getUsersWithConversations(User $user)
    {
        $userId = $user->id;
        
        $query = DB::table('users')
            ->leftJoin('conversations', function($join) use ($userId) {
                $join->on(function($query) use ($userId) {
                    $query->on('conversations.user_id2', '=', 'users.id')
                        ->where('conversations.user_id1', '=', $userId);
                })
                ->orOn(function($query) use ($userId) {
                    $query->on('conversations.user_id1', '=', 'users.id')
                        ->where('conversations.user_id2', '=', $userId);
                });
            })
            ->select('users.*', 'conversations.id as conversation_id', 'conversations.name as conversation_name', 
                    'conversations.user_id1', 'conversations.user_id2', 
                    'conversations.created_at as conversation_created_at', 
                    'conversations.updated_at as conversation_updated_at')
            ->where('users.id', '!=', $userId);
        
        if (!$user->isAdmin()) {
            $query->whereNotNull('conversations.id')
                ->where('users.is_blocked', '=', false);
        }
        
        return $query->get();
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token, $this->email));
    }

}

