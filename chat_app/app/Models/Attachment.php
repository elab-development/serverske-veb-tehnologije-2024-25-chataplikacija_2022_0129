<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'message_id',
        'name',
        'path',
        'mime',
        'size',
        'is_giphy',
    ];

    protected $casts = [
        'is_giphy' => 'boolean',
    ];

    protected $appends = [ 'url', 'type' ];

    public function getUrlAttribute()
    {
        return asset('storage/' . $this->path);
    }

    public function getTypeAttribute()
    {
        if (str_starts_with($this->mime, 'image/')) return 'image';
        if (str_starts_with($this->mime, 'video/')) return 'video';
        if (str_starts_with($this->mime, 'audio/')) return 'audio';
        if (in_array($this->mime, ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])) return 'document';
        return 'file';
    }

    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
