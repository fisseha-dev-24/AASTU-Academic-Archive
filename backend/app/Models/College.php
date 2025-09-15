<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class College extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'dean_id',
        'is_active'
    ];

    /**
     * Get the dean of this college.
     */
    public function dean()
    {
        return $this->belongsTo(User::class, 'dean_id');
    }

    /**
     * Get all departments in this college.
     */
    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    /**
     * Get all users in this college (through departments).
     */
    public function users()
    {
        return $this->hasManyThrough(User::class, Department::class);
    }

    /**
     * Get all documents in this college (through departments).
     */
    public function documents()
    {
        return $this->hasManyThrough(Document::class, Department::class);
    }

    /**
     * Get all video uploads in this college (through departments).
     */
    public function videoUploads()
    {
        return $this->hasManyThrough(VideoUpload::class, Department::class);
    }
}