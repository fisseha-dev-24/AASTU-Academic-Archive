<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VideoUpload extends Model
{
    protected $fillable = [
        'title',
        'description',
        'video_url',
        'video_platform',
        'video_id',
        'thumbnail_url',
        'duration',
        'department_id',
        'category_id',
        'user_id',
        'year',
        'keywords',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
        'views',
        'likes',
        'is_featured'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'is_featured' => 'boolean'
    ];

    /**
     * Get the teacher who uploaded this video.
     */
    public function uploader()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the department this video belongs to.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the category this video belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the department head who approved this video.
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Extract video ID from YouTube URL.
     */
    public static function extractYouTubeId($url)
    {
        $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/';
        preg_match($pattern, $url, $matches);
        return isset($matches[1]) ? $matches[1] : null;
    }

    /**
     * Extract video ID from Vimeo URL.
     */
    public static function extractVimeoId($url)
    {
        $pattern = '/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/';
        preg_match($pattern, $url, $matches);
        return isset($matches[1]) ? $matches[1] : null;
    }

    /**
     * Get the video platform from URL.
     */
    public static function getVideoPlatform($url)
    {
        if (strpos($url, 'youtube.com') !== false || strpos($url, 'youtu.be') !== false) {
            return 'youtube';
        } elseif (strpos($url, 'vimeo.com') !== false) {
            return 'vimeo';
        }
        return 'other';
    }

    /**
     * Get embed URL for the video.
     */
    public function getEmbedUrlAttribute()
    {
        switch ($this->video_platform) {
            case 'youtube':
                return "https://www.youtube.com/embed/{$this->video_id}";
            case 'vimeo':
                return "https://player.vimeo.com/video/{$this->video_id}";
            default:
                return $this->video_url;
        }
    }
}