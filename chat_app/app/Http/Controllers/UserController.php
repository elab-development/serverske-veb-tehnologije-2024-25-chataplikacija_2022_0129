<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    private function xssProtect($value)
    {
        if (is_string($value)) {
            
            return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        }
        return $value;
    }

    public function getUsers(Request $request){
        try {
            $data = User::getUsersWithConversations($request->user());
            
            return response()->json(
                $data->map(function ($item) {
                    return [
                        'user' => [
                            'id' => $item->id,
                            'name' => $this->xssProtect($item->name),
                            'email' => $this->xssProtect($item->name),
                            'password' => $item->password,
                            'is_admin' => $item->is_admin,
                            'is_blocked' => $item->is_blocked,
                            'created_at' => $item->created_at,
                            'updated_at' => $item->updated_at,
                        ],
                        'conversation' => $item->conversation_id ? [
                            'id' => $item->conversation_id,
                            'name' => $this->xssProtect($item->conversation_name),
                            'user_id1' => $item->user_id1,
                            'user_id2' => $item->user_id2,
                            'created_at' => $item->conversation_created_at,
                            'updated_at' => $item->conversation_updated_at,
                        ] : null
                    ];
                })
            );
        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
