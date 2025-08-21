<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'ip_address'
    ];

    // Audit log belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
