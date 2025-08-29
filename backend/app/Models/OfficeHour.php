<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficeHour extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'day',
        'time',
        'location',
        'type',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the teacher who owns this office hour
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the type color class for UI styling
     */
    public function getTypeColorClassAttribute()
    {
        $colors = [
            'regular' => 'bg-gray-50',
            'online' => 'bg-blue-50',
            'by_appointment' => 'bg-purple-50',
        ];

        return $colors[$this->type] ?? 'bg-gray-50';
    }

    /**
     * Scope to get active office hours
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
