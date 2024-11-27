<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Metodebayar extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['akun_id', 'nama_metodebayar'];
}
