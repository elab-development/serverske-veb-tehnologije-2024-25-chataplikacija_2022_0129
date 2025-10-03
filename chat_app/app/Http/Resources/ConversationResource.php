<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
  public function toArray($request)
    {
        return [
            'id' => $this->id,
            'user1_name' => $this->user1->name ?? null,
            'user2_name' => $this->user2->name ?? null,
            'last_message_content' => $this->lastMessage->content ?? null,
          
        ];
    }
}
