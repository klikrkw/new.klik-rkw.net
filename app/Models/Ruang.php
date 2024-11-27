<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ruang extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['id', 'nama_ruang', 'kantor_id','image_ruang','kode_ruang'];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_ruang', 'like', '%' . $search . '%')
                    ->orWhere('kode_ruang', 'like', '%' . $search . '%');
            });
        });
    }

    public function kantor()
    {
        return $this->belongsTo(Kantor::class);
    }

    public static function getKodeRuang(Ruang $ruang)
    {
        $count = Ruang::count();
        return sprintf('%s.%s', $ruang->kantor_id, $count+1);
    }

    public static function boot()
    {
        parent::boot();
        self::creating(function (Ruang $ruang) {
            $ruang->kode_ruang = Ruang::getKodeRuang($ruang);
        });
    }

}

