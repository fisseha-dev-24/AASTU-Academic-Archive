<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'title',
        'author',
        'department_id',
        'user_id',
        'category_id',
        'year',
        'supervisor',
        'document_type',
        'tags',
        'file_path',
        'status'
    ];

    // Document belongs to uploader (descriptive)
    public function uploader()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Alias for controller compatibility
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Document belongs to department
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // Document belongs to category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Document has many reviews
    public function reviews()
    {
        return $this->hasMany(DocumentReview::class);
    }
}
