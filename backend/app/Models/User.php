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

    /**
     * Get the notifications for the user.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get the user activities for the user.
     */
    public function activities()
    {
        return $this->hasMany(UserActivity::class);
    }

    /**
     * Get the document analytics for the user.
     */
    public function documentAnalytics()
    {
        return $this->hasMany(DocumentAnalytics::class);
    }

    /**
     * Get the department that the user heads (if department head).
     */
    public function headedDepartment()
    {
        return $this->hasOne(Department::class, 'head_id');
    }
}
