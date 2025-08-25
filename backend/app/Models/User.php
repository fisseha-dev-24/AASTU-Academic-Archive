<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'department_id',
        'role',
        'student_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // A user belongs to one department
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // A user can upload many documents
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    // A user can have many document reviews
    public function reviews()
    {
        return $this->hasMany(DocumentReview::class, 'reviewer_id');
    }
}
