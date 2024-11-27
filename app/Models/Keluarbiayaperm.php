<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keluarbiayaperm extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'transpermohonan_id',
        'user_id',
        'metodebayar_id',
        'itemkegiatan_id',
        'rekening_id',
        'jumlah_keluarbiayaperm',
        'catatan_keluarbiayaperm',
        'image_keluarbiayaperm'

    ];
    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        $date = $now->day;
        $rec = Keluarbiayaperm::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 6) + 1 : 1, 4, '0', STR_PAD_LEFT);
    }


    public static function boot()
    {
        parent::boot();
        self::creating(function (Keluarbiayaperm $keluarbiayaperm) {
            $user = auth()->user();
            $keluarbiayaperm->id = Keluarbiayaperm::getPrimaryId();
            $keluarbiayaperm->user_id = $user->id;
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function transpermohonan()
    {
        return $this->belongsTo(Transpermohonan::class);
    }

    // public function biayaperm()
    // {
    //     return $this->belongsTo(Biayaperm::class);
    // }
    public function metodebayar()
    {
        return $this->belongsTo(Metodebayar::class);
    }
    public function itemkegiatan()
    {
        return $this->belongsTo(Itemkegiatan::class);
    }

    public function jurnalumums()
    {
        return $this->belongsToMany(Jurnalumum::class, 'keluarbiayaperm_jurnalumums', 'keluarbiayaperm_id', 'jurnalumum_id');
    }
    public function rekening()
    {
        return $this->belongsTo(Rekening::class);
    }

}
