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
        'college_id',
        'role',
        'student_id',
        'is_active',
        'status',
        'phone',
        'address',
        'bio',
        'profile_picture',
        'last_login_at',
        'qualification',
        'specialization',
        'office_location',
        'office_hours',
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

    // A user belongs to one college
    public function college()
    {
        return $this->belongsTo(College::class);
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

    /**
     * Get the college that the user is dean of (if college dean).
     */
    public function headedCollege()
    {
        return $this->hasOne(College::class, 'dean_id');
    }

}
