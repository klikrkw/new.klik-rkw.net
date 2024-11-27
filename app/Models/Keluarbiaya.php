<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keluarbiaya extends Model
{
    use HasFactory;
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id',
        'user_id',
        'instansi_id',
        'rekening_id',
        'metodebayar_id',
        'status_keluarbiaya',
        'saldo_awal',
        'jumlah_biaya',
        'saldo_akhir'
    ];

    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        $date = $now->day;
        $rec = Keluarbiaya::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return 'N' . substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 7) + 1 : 1, 3, '0', STR_PAD_LEFT);
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('id', 'like', '%' . $search . '%');
            });
        });
        $query->when($filters['status_keluarbiaya'] ?? null, function ($query, $status) {
            $query->where('status_keluarbiaya', '=', $status);
        });

    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Keluarbiaya $keluarbiaya) {
            $user = auth()->user();
            $keluarbiaya->id = Keluarbiaya::getPrimaryId();
            $keluarbiaya->user_id = $user->id;
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function instansi()
    {
        return $this->belongsTo(Instansi::class);
    }
    public function metodebayar()
    {
        return $this->belongsTo(Metodebayar::class);
    }
    public function kasbons()
    {
        return $this->belongsToMany(Kasbon::class, 'keluarbiaya_kasbons', 'keluarbiaya_id', 'kasbon_id');
    }
    public function dkeluarbiayas()
    {
        return $this->hasMany(Dkeluarbiaya::class);
    }
    public function rekening()
    {
        return $this->belongsTo(Rekening::class);
    }

}
