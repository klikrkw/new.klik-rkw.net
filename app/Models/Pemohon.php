<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemohon extends Model
{
    use HasFactory;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nama_pemohon',
        'alamat_pemohon',
        'email_pemohon',
        'telp_pemohon',
        'nik_pemohon',
        'active',
        'nodaftar_pemohon',
        'thdaftar_pemohon',
    ];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_pemohon', 'like', '%' . $search . '%')
                    ->orWhere('alamat_pemohon', 'like', '%' . $search . '%');
            });
        })
            ->when($filters['user_id'] ?? null, function ($query, $user_id) {
                $query->whereHas('users', fn ($q) => $q->where('user_id', $user_id));
            });
    }

    public static function getYear()
    {
        $now = Carbon::now();
        $year = $now->year;
        // $rec = Jurnalumum::select('id')->whereDate('created_at', '=', $now->toDateString())->orderBy('id', 'desc')
        //     ->skip(0)->take(1)->first();
        // return substr($year, 2) . str_pad($month, 2, '0', STR_PAD_LEFT) . str_pad($date, 2, '0', STR_PAD_LEFT) . str_pad($rec ? (int) substr($rec->id, 6) + 1 : 1, 4, '0', STR_PAD_LEFT);
        return $year;
    }
    public static function getPrimaryId()
    {
        $now = Carbon::now();
        $year = $now->year;
        $rec = Pemohon::select('nodaftar_pemohon')->where('thdaftar_pemohon', '=', $now->year)->orderBy('id', 'desc')
            ->skip(0)->take(1)->first();
        return $year . str_pad($rec ? (int) $rec->nodaftar_pemohon + 1 : 1, 6, '0', STR_PAD_LEFT);
    }

    public static function getNoDaftar()
    {
        $now = Carbon::now();
        $year = $now->year;
        $rec = Pemohon::where('thdaftar_pemohon', $year)->orderBy('nodaftar_pemohon', 'desc')->skip(0)->take(1)->first();
        $code = 1;
        if ($rec) {
            $code = $rec->nodaftar_pemohon + 1;
        }
        return $code;
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Pemohon $pemohon) {
            $pemohon->id = Pemohon::getPrimaryId();
            $pemohon->thdaftar_pemohon = Pemohon::getYear();
            $pemohon->nodaftar_pemohon = Pemohon::getNoDaftar();
        });
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'pemohon_users', 'pemohon_id', 'user_id');
    }
}
