<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengaturan extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'nama_rekening',
        'nama_pengaturan',
        'tipe_data',
        'nilai',
    ];

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('nama_pengaturan', 'like', '%' . $search . '%')
                    ->orWhere('grup', 'like', '%' . $search . '%');
            });
        });
    }
public static function getNilai(string $nama_pengaturan)
    {
        $pengaturan = Pengaturan::where('nama_pengaturan', $nama_pengaturan)->first();
        return $pengaturan ? $pengaturan->nilai : null;
    }
}
