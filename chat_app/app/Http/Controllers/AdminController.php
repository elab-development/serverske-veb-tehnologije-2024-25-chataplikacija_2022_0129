<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;


class AdminController extends Controller
{
    public function getUsers(Request $request)
    {
        $search = $request->get('search', '');
        $filter = $request->get('filter', 'all'); // all, blocked, admins

        $query = User::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        switch ($filter) {
            case 'blocked':
                $query->where('is_blocked', true);
                break;
            case 'admins':
                $query->where('is_admin', true);
                break;
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return response()->json($users);
    }

    public function blockUser(Request $request, User $user)
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Cannot block admin users'], 403);
        }

        $user->update(['is_blocked' => true]);
        $safeUser = [
        'id' => $user->id,
        'name' => htmlspecialchars($user->name, ENT_QUOTES, 'UTF-8'),
        'email' => htmlspecialchars($user->email, ENT_QUOTES, 'UTF-8'),
        'is_admin' => $user->is_admin,
        'is_blocked' => $user->is_blocked,
        'created_at' => $user->created_at,
        'updated_at' => $user->updated_at,
        ];
        return response()->json(['message' => 'User blocked successfully', 'user' => $safeUser]);
    }

    public function unblockUser(Request $request, User $user)
    {
        $user->update(['is_blocked' => false]);

         $safeUser = [
        'id' => $user->id,
        'name' => htmlspecialchars($user->name, ENT_QUOTES, 'UTF-8'),
        'email' => htmlspecialchars($user->email, ENT_QUOTES, 'UTF-8'),
        'is_admin' => $user->is_admin,
        'is_blocked' => $user->is_blocked,
        'created_at' => $user->created_at,
        'updated_at' => $user->updated_at,
        ];
        return response()->json(['message' => 'User unblocked successfully', 'user' => $safeUser]);
    }

    public function deleteUser(Request $request, User $user)
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Cannot delete admin users'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function makeUserAdmin(Request $request, User $user)
    {
        $user->update(['is_admin' => true]);

          $safeUser = [
        'id' => $user->id,
        'name' => htmlspecialchars($user->name, ENT_QUOTES, 'UTF-8'),
        'email' => htmlspecialchars($user->email, ENT_QUOTES, 'UTF-8'),
        'is_admin' => $user->is_admin,
        'is_blocked' => $user->is_blocked,
        'created_at' => $user->created_at,
        'updated_at' => $user->updated_at,
        ];
       
        return response()->json(['message' => 'User made admin successfully', 'user' => $safeUser]);
    }
}
