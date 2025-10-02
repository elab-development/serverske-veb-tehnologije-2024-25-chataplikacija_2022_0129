<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::resource('messages', MessageController::class)->middleware('auth');

Route::post('/conversations/by-user', [ConversationController::class, 'listByUser']);
Route::get('/conversations', [ConversationController::class, 'searchByName']);
Route::put('/conversations', [ConversationController::class, 'update']);

Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::delete('/users/{user}/delete', [AdminController::class, 'deleteUser']);
    Route::post('/users/{user}/block', [AdminController::class, 'blockUser']);
    Route::post('/users/{user}/unblock', [AdminController::class, 'unblockUser']);
});