<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dkeluarbiayapermuser extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'keluarbiayapermuser_id',
        'transpermohonan_id',
        'itemkegiatan_id',
        'jumlah_biaya',
        'ket_biaya',
        'image_dkeluarbiayapermuser',
    ];
    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        $date = $now->day;
        $rec = Dkeluarbiayapermuser::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 6) + 1 : 1, 4, '0', STR_PAD_LEFT);
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Dkeluarbiayapermuser $dkeluarbiayapermuser) {
            $dkeluarbiayapermuser->id = Dkeluarbiayapermuser::getPrimaryId();
        });
    }

    public function keluarbiayapermuser()
    {
        return $this->belongsTo(Keluarbiayapermuser::class);
    }
    public function transpermohonan()
    {
        return $this->belongsTo(Transpermohonan::class);
    }
    public function itemkegiatan()
    {
        return $this->belongsTo(Itemkegiatan::class);
    }
    public function jurnalumums()
    {
        return $this->belongsToMany(Jurnalumum::class, 'dkeluarbiayapermuser_jurnalumums', 'dkeluarbiayapermuser_id', 'jurnalumum_id');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('ket_biaya', 'like', '%' . $search . '%');
            });
        });
        $query->when($filters['itemkegiatan_id'] ?? null, function ($query, $itemkegiatan_id) {
            $query->where('itemkegiatan_id', '=', $itemkegiatan_id);
        });
        $query->when($filters['user_id'] ?? null, function ($query, $user_id) {
            $query->where('keluarbiayapermusers.user_id', '=', $user_id);
        });
        $query->when($filters['transpermohonan_id'] ?? null, function ($query, $transpermohonan_id) {
            $query->where('transpermohonan_id', '=', $transpermohonan_id);
        });
    }
    protected function tglDkeluarbiayapermuser(): Attribute
    {
        return Attribute::make(
            get: fn () => Carbon::parse($this->created_at)->format('d F Y')
        );
    }
}
