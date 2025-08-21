<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name'];

    // A category can have many documents
    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
