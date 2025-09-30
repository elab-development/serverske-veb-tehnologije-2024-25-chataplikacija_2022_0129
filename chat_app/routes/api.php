<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ConversationController;

Route::resource('messages', MessageController::class)->middleware('auth');
Route::post('/conversations/by-user', [ConversationController::class, 'listByUser']);
Route::get('/conversations', [ConversationController::class, 'searchByName']);
Route::put('/conversations', [ConversationController::class, 'update']);