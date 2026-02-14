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
            'name' => $this->name,
            'user_id1' => $this->user_id1,
            'user_id2' => $this->user_id2,
        ];
    }
}
