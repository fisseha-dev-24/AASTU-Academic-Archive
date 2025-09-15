<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name', 'code', 'description', 'head_id', 'college_id', 'is_active'];

    // A department has many users
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // A department can have many documents
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Get the department head.
     */
    public function head()
    {
        return $this->belongsTo(User::class, 'head_id');
    }

    /**
     * Get the college this department belongs to.
     */
    public function college()
    {
        return $this->belongsTo(College::class);
    }

    /**
     * Get all video uploads for this department.
     */
    public function videoUploads()
    {
        return $this->hasMany(VideoUpload::class);
    }
}
