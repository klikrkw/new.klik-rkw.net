<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kasbon extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'user_id',
        'jumlah_kasbon',
        'jumlah_penggunaan',
        'sisa_penggunaan',
        'keperluan',
        'status_kasbon',
        'instansi_id',
        'jenis_kasbon'
    ];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('keperluan', 'like', '%' . $search . '%');
            });
        });
    }
    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        $date = $now->day;
        $rec = Kasbon::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return 'K' . substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 7) + 1 : 1, 3, '0', STR_PAD_LEFT);
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Kasbon $kasbon) {
            $user = auth()->user();
            $kasbon->id = Kasbon::getPrimaryId();
            if (request('user_id') == null) {
                $kasbon->user_id = $user->id;
            }
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

    public function jurnalumums()
    {
        return $this->belongsToMany(Jurnalumum::class, 'kasbon_jurnalumums', 'kasbon_id', 'jurnalumum_id');
    }
    public function dkasbons()
    {
        return $this->hasMany(Dkasbon::class);
    }
    public function dkasbonnoperms()
    {
        return $this->hasMany(Dkasbonnoperm::class);
    }

}
