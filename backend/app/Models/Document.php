<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'title',
        'description',
        'author',
        'department_id',
        'user_id',
        'category_id',
        'year',
        'semester',
        'academic_year',
        'supervisor',
        'document_type',
        'keywords',
        'tags',
        'file_path',
        'file_size',
        'file_type',
        'version',
        'is_featured',
        'expires_at',
        'status',
        'views',
        'downloads'
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

    /**
     * Get the analytics for this document.
     */
    public function analytics()
    {
        return $this->hasMany(DocumentAnalytics::class);
    }

    /**
     * Get the view count for this document.
     */
    public function getViewCountAttribute()
    {
        return $this->analytics()->where('action', 'view')->count();
    }

    /**
     * Get the download count for this document.
     */
    public function getDownloadCountAttribute()
    {
        return $this->analytics()->where('action', 'download')->count();
    }
}
