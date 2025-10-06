<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']); //ova
Route::post('/login', [AuthController::class, 'login']); //ova
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']); //ova
    Route::get('/user', [AuthController::class, 'me']);

    Route::post('/send-message', [MessageController::class, 'sendMessage']); //ova
});

Route::get('/conversations/by-user', [ConversationController::class, 'listByUser']);
Route::get('/conversations', [ConversationController::class, 'searchByName']); //ova
Route::put('/conversations', [ConversationController::class, 'update']);

Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::delete('/users/{user}/delete', [AdminController::class, 'deleteUser']);
    Route::put('/users/{user}/block', [AdminController::class, 'blockUser']);
    Route::put('/users/{user}/unblock', [AdminController::class, 'unblockUser']);

    Route::apiResource('/messages', MessageController::class); //ova
    
});