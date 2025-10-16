<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $expiresAt = Carbon::now()->addDays(7);
        $token = $user->createToken('auth_token', ['*'], $expiresAt)->plainTextToken;;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'expires_at' => $expiresAt->toIso8601String(),
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'No account found with this email address.',
                'errors' => [
                    'email' => ['No account found with this email address.']
                ]
            ], 422);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The password is incorrect.',
                'errors' => [
                    'email' => ['The password is incorrect.']
                ]
            ], 422);
        }

        if ($user->is_blocked) {
            return response()->json([
                'message' => 'Your account has been blocked.',
                'errors' => [
                    'general' => ['Your account has been blocked.']
                ]
            ], 403);
        }

        $user->tokens()->delete();

        if ($request->remember) {
            $expiresAt = Carbon::now()->addYear();
        } else{
            $expiresAt = Carbon::now()->addDay();
        }

        $token = $user->createToken('auth_token', ['*'], $expiresAt)->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
