<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name'];

    // Many-to-many relationship with users
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
