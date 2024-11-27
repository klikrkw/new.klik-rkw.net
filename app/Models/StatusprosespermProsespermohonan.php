<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatusprosespermProsespermohonan extends Model
{
    use HasFactory;
    protected $fillable = [
        'prosespermohonan_id',
        'statusprosesperm_id',
        'user_id',
        'catatan_statusprosesperm',
        'active',
    ];
    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        $date = $now->date;
        $rec = StatusprosespermProsespermohonan::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 6) + 1 : 1, 4, '0', STR_PAD_LEFT);
    }


    // public static function boot()
    // {
    //     parent::boot();
    //     self::creating(function (StatusprosespermProsespermohonan $statusprosespermProsespermohonan) {
    //         $statusprosespermProsespermohonan->id = StatusprosespermProsespermohonan::getPrimaryId();
    //     });
    // }
}
