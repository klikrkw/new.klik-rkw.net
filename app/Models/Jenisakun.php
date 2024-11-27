<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jenisakun extends Model
{
    use HasFactory;
    protected $fillable = ['nama_jenisakun', 'kode_jenisakun'];
    public $timestamps = false;
}
