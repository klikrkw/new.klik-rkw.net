<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KeluarbiayapermJurnalumum extends Model
{
    use HasFactory;
    protected $fillable = [
        'jurnalumum_id',
        'keluarbiayaperm_id',
    ];
}
