<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Drincianbiayaperm extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'rincianbiayaperm_id',
        'itemrincianbiayaperm_id',
        'jumlah_biaya',
        'ket_biaya',
    ];
    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        $date = $now->day;
        $rec = Drincianbiayaperm::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 6) + 1 : 1, 4, '0', STR_PAD_LEFT);
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Drincianbiayaperm $dkeluarbiayapermuser) {
            $dkeluarbiayapermuser->id = Drincianbiayaperm::getPrimaryId();
        });
    }
    public function rincianbiayaperm()
    {
        return $this->belongsTo(Rincianbiayaperm::class);
    }
    public function itemrincianbiayaperm()
    {
        return $this->belongsTo(Itemrincianbiayaperm::class);
    }

}
