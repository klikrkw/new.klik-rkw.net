<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BayarbiayapermJurnalumum extends Model
{
    use HasFactory;
    protected $fillable = [
        'jurnalumum_id',
        'bayarbiayaperm_id',
    ];
}
