<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Posisiberkas extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $fillable = [
        'id','tempatberkas_id','row','col'
    ];
    public function tempatberkas()
    {
        return $this->belongsTo(Tempatberkas::class);
    }
    public static function getPrimaryId(Posisiberkas $posisiberka)
    {
        return str_pad($posisiberka->tempatberkas_id, 3, '0', STR_PAD_LEFT).'.'.$posisiberka->row.'.'.$posisiberka->col.'.';
    }
    //     public static function boot()
    // {
    //     parent::boot();
    //     self::creating(function (Posisiberkas $posisiberka) {
    //         $posisiberka->id = Transpermohonan::getPrimaryId($posisiberka);
    //     });
    // }

}
