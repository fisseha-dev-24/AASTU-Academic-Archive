<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deadline extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'title',
        'course_code',
        'type',
        'priority',
        'due_date',
        'description',
        'is_completed',
    ];

    protected $casts = [
        'due_date' => 'date',
        'is_completed' => 'boolean',
    ];

    /**
     * Get the teacher who owns this deadline
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the priority color class for UI styling
     */
    public function getPriorityColorClassAttribute()
    {
        $colors = [
            'high' => 'bg-red-100 text-red-800',
            'medium' => 'bg-orange-100 text-orange-800',
            'low' => 'bg-green-100 text-green-800',
        ];

        return $colors[$this->priority] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Scope to get upcoming deadlines
     */
    public function scopeUpcoming($query)
    {
        return $query->where('due_date', '>=', now()->toDateString())
                    ->where('is_completed', false)
                    ->orderBy('due_date');
    }
}
