<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    Route::get('/users-with-conversations', [UserController::class, 'getUsers']);

    
    //Route::get('/conversations/by-user', [ConversationController::class, 'listByUser']);
    Route::get('/conversations', [ConversationController::class, 'searchByName']);
    Route::post('/conversation', [ConversationController::class, 'store']);
    Route::put('/conversations/{id}', [ConversationController::class, 'update']);
    
    Route::post('/send-message', [MessageController::class, 'sendMessage']);
    Route::get('/messages/by-conversation', [MessageController::class, 'getMessagesByConversation']);
});

Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::delete('/users/{user}/delete', [AdminController::class, 'deleteUser']);
    Route::put('/users/{user}/block', [AdminController::class, 'blockUser']);
    Route::put('/users/{user}/unblock', [AdminController::class, 'unblockUser']);
    Route::put('/users/{user}/make-admin', [AdminController::class, 'makeUserAdmin']);


    Route::apiResource('/messages', MessageController::class);
    
});