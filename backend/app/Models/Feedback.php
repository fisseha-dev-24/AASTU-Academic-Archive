<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id',
        'student_id',
        'teacher_id',
        'course_name',
        'rating',
        'comment',
        'is_helpful',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_helpful' => 'boolean',
    ];

    /**
     * Get the document that this feedback is for
     */
    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    /**
     * Get the student who gave this feedback
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the teacher who received this feedback
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
