<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'title',
        'code',
        'type',
        'day',
        'time',
        'location',
        'students',
        'color',
        'is_active',
    ];

    protected $casts = [
        'students' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the teacher who owns this schedule
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the color class for UI styling
     */
    public function getColorClassAttribute()
    {
        $colors = [
            'lecture' => 'bg-blue-100 text-blue-800',
            'lab' => 'bg-purple-100 text-purple-800',
            'tutorial' => 'bg-emerald-100 text-emerald-800',
            'exam' => 'bg-red-100 text-red-800',
            'office_hours' => 'bg-orange-100 text-orange-800',
        ];

        return $colors[$this->type] ?? 'bg-gray-100 text-gray-800';
    }
}
