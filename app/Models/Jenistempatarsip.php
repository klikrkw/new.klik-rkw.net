<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jenistempatarsip extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'nama_jenistempatarsip','image_jenistempatarsip'
    ];

}
