<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jurnalumum extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'akun_id',
        'user_id',
        'debet',
        'kredit',
        'uraian',
        'parent_id',
        'no_urut',
    ];

    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        $date = $now->day;
        $rec = Jurnalumum::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 6) + 1 : 1, 4, '0', STR_PAD_LEFT);
    }

    public static function getNourut()
    {
        $now = Carbon::now();
        $year = $now->year;
        $rec = Jurnalumum::select('no_urut')->whereYear('created_at', '=', $year)->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return $rec ? $rec->no_urut + 1 : 1;
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Jurnalumum $jurnalumum) {
            $user = auth()->user();
            $jurnalumum->id = Jurnalumum::getPrimaryId();
            $jurnalumum->user_id = $user->id;
            $jurnalumum->no_urut = Jurnalumum::getNourut();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function akun()
    {
        return $this->belongsTo(Akun::class);
    }
}
