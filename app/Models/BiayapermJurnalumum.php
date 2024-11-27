<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BiayapermJurnalumum extends Model
{
    use HasFactory;
    protected $fillable = [
        'jurnalumum_id',
        'biayaperm_id',
    ];
}
