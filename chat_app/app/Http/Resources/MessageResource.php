<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{/**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'conversation_id' => $this->conversation_id,
            'sender_name' => $this->sender->name,
            'receiver_name' => $this->receiver->name,
            'attachments' => $this->attachments->map(function ($attachment) {
                return [
                    'filename' => $attachment->name,
                    'url' => $attachment->path,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

 
