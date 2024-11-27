<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelompokakun extends Model
{
    use HasFactory;
    protected $fillable = ['nama_kelompokakun', 'kode_kelompokakun', 'jenisakun_id'];
    public $timestamps = false;

    public function jenisakun()
    {
        return $this->belongsTo(Jenisakun::class);
    }
}
