<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;
use App\Http\Resources\UserResource;

Broadcast::routes(['middleware' => ['auth:sanctum']]);

Broadcast::channel('online', function ($user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::find($conversationId);
    return $conversation && $conversation->hasUser($user->id);
});