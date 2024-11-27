<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFirebase extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'fcmToken',
        'fcmTokenMobile',
        'uid'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
