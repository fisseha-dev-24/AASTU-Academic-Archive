<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentReview extends Model
{
    protected $fillable = [
        'document_id',
        'user_id',
        'status',
        'comments'
    ];

    // Review belongs to a document
    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    // Review belongs to a reviewer
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
