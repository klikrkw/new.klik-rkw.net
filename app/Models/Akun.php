<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Akun extends Model
{
    use HasFactory;
    protected $fillable = ['kelompokakun_id', 'nama_akun', 'kode_akun', 'slug'];
    public $timestamps = false;
    public function kelompokakun()
    {
        return $this->belongsTo(Kelompokakun::class);
    }
    // $question->slug = Str::slug($question->title);
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_akun', 'like', '%' . $search . '%');
            });
        });
    }

    public static function getKodeAkun($slug)
    {
        $rec = Akun::where('slug', '=', $slug)->skip(0)->take(1)->first();
        return $rec ? $rec->id : null;
    }


    private static function findKodeakun($id)
    {
        $kakun = Kelompokakun::find($id);
        $kode = '';
        if ($kakun) {
            $kode = $kakun->kode_kelompokakun;
        }
        $rec = Akun::select('kode_akun')->where('kelompokakun_id', 'like', $id)->orderBy('kode_akun', 'desc')
            ->skip(0)->take(1)->first();

        return $kode . str_pad($rec ? (int) substr($rec->kode_akun, 3) + 1 : 1, 3, '0', STR_PAD_LEFT);
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Akun $akun) {
            $akun->slug = Str::slug($akun->nama_akun);
            $akun->kode_akun = Akun::findKodeakun($akun->kelompokakun_id);
        });

        self::updating(function (Akun $akun) {
            $akun->slug = Str::slug($akun->nama_akun);
            $akun->kode_akun = Akun::findKodeakun($akun->kelompokakun_id);
        });
    }
}
