<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bayarbiayaperm extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'biayaperm_id',
        'metodebayar_id',
        'info_rekening',
        'rekening_id',
        'saldo_awal',
        'jumlah_bayar',
        'saldo_akhir',
        'user_id',
        'catatan_bayarbiayaperm',
        'image_bayarbiayaperm',
    ];
    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        $date = $now->day;
        $rec = Bayarbiayaperm::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 6) + 1 : 1, 4, '0', STR_PAD_LEFT);
    }


    public static function boot()
    {
        parent::boot();
        self::creating(function (Bayarbiayaperm $biayaperm) {
            $user = auth()->user();
            $biayaperm->id = Bayarbiayaperm::getPrimaryId();
            $biayaperm->user_id = $user->id;
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function biayaperm()
    {
        return $this->belongsTo(Biayaperm::class);
    }
    public function metodebayar()
    {
        return $this->belongsTo(Metodebayar::class);
    }

    public function jurnalumums()
    {
        return $this->belongsToMany(Jurnalumum::class, 'bayarbiayaperm_jurnalumums', 'bayarbiayaperm_id', 'jurnalumum_id');
    }
    public function rekening()
    {
        return $this->belongsTo(Rekening::class);
    }
    protected function tglBayarbiayaperm(): Attribute
    {
        return Attribute::make(
            get: fn () => Carbon::parse($this->created_at)->format('d F Y')
        );
    }

}
