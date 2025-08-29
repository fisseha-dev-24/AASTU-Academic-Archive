<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name'];

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
}
